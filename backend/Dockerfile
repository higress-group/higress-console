FROM openjdk:18-jdk-slim

WORKDIR /app
COPY target/higress-console-0.0.1-SNAPSHOT.jar /app
COPY start.sh /app

EXPOSE 8080
CMD ["/app/start.sh"]