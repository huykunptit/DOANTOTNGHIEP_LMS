FROM gradle:8.10.2-jdk21 AS build
WORKDIR /workspace
COPY gradlew gradlew.bat settings.gradle.kts build.gradle.kts gradle.properties ./
COPY gradle/ gradle/
COPY common-lib/build.gradle.kts common-lib/
COPY common-lib/src/ common-lib/src/
COPY api-gateway/build.gradle.kts api-gateway/
COPY api-gateway/src/ api-gateway/src/
RUN gradle --no-daemon --max-workers=2 :api-gateway:bootJar -x test
# Rename plain jar để wildcard COPY chỉ lấy bootJar
RUN mv /workspace/api-gateway/build/libs/*-plain.jar /workspace/api-gateway/build/libs/plain.jar.bak || true

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/api-gateway/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75", \
  "-jar", "/app/app.jar"]
