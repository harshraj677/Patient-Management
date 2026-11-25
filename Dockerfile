# Render build recipe for the Spring Boot backend (works with Render's Root Directory left blank).
# Render has no native Java runtime, so Java apps are built from a Dockerfile.

# Stage 1: build the jar with the Maven wrapper
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw -q -B dependency:go-offline
COPY backend/src src
RUN ./mvnw -q -B -DskipTests package

# Stage 2: run the jar on a small JRE image
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV JAVA_OPTS="-Xmx384m -XX:+UseSerialGC"
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
