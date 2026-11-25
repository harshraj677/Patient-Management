# Render build recipe (repo root): official Maven + JDK 21 build stage, JRE 21 runtime stage.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# server.port=${PORT:8080} in application.properties, so Render's PORT is used.
CMD ["java", "-Xmx384m", "-XX:+UseSerialGC", "-jar", "app.jar"]
