FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
# Copy toàn bộ cấu trúc fast-jar của Quarkus vào container
COPY --from=build /app/target/quarkus-app/ .

# Mở cổng (Nhớ đổi thành 8083 cho booking và 8081 cho user)
EXPOSE 8083

# Chạy file run mặc định của Quarkus
CMD ["java", "-jar", "quarkus-run.jar"]