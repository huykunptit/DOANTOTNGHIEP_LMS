FROM gradle:8.10.2-jdk21 AS build
WORKDIR /workspace
COPY gradlew gradlew.bat settings.gradle.kts build.gradle.kts gradle.properties ./
COPY gradle/ gradle/
COPY common-lib/build.gradle.kts common-lib/
COPY common-lib/src/ common-lib/src/
COPY backend/build.gradle.kts backend/
COPY backend/src/ backend/src/
# Cache deps layer
RUN gradle --no-daemon :backend:dependencies --configuration runtimeClasspath -q || true
# Build bootJar only (skip tests)
RUN gradle --no-daemon --max-workers=2 :backend:bootJar -x test
# Rename để tránh ambiguous wildcard: đổi plain.jar thành .jar.plain
RUN mv /workspace/backend/build/libs/*-plain.jar /workspace/backend/build/libs/plain.jar.bak || true

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/backend/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75", \
  "-jar", "/app/app.jar"]
