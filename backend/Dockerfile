FROM openjdk:18-jdk-slim

RUN apt-get update && apt-get install -y \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY console/target/higress-console.jar /app
COPY start.sh /app

EXPOSE 8080
CMD ["/app/start.sh"]