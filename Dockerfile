FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml backend/maven-mirror-settings.xml ./
COPY backend/src ./src
# Retry the normal Maven Central build; if Render's network to it fails, fall back to Google's Central mirror.
ENV MVN_OPTS="-B -ntp -DskipTests -Dmaven.wagon.http.retryHandler.count=5 -Dmaven.wagon.httpconnectionManager.ttlSeconds=30"
RUN mvn $MVN_OPTS clean package \
 || (echo ">>> Retrying via mirror" && mvn -s maven-mirror-settings.xml $MVN_OPTS clean package) \
 || (echo ">>> Retrying via mirror (2)" && mvn -s maven-mirror-settings.xml $MVN_OPTS clean package)

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["sh", "-c", "java -Xmx384m -XX:+UseSerialGC -Dserver.port=${PORT:-10000} -jar app.jar"]
