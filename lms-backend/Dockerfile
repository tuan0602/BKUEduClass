# Stage 1: Build file JAR
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY lms-backend/pom.xml .
COPY lms-backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]