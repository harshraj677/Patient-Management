# Render build recipe (repo root). Uses the official Maven + JDK 21 image, so no Maven download is needed.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml ./
RUN mvn -q -B dependency:go-offline
COPY backend/src src
RUN mvn -q -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV JAVA_OPTS="-Xmx384m -XX:+UseSerialGC"
EXPOSE 8080
# application.properties reads server.port=${PORT:8080}; Render injects PORT.
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
