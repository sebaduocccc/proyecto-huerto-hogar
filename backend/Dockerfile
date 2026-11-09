# ---------- etapa 1: compilar ----------
FROM docker.io/library/maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# primero solo el pom para cachear las dependencias
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package

# ---------- etapa 2: ejecutar ----------
FROM docker.io/library/eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 1001 spring
COPY --from=build /app/target/*.jar app.jar
USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
