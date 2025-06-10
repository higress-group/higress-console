FROM openjdk:21-jdk-slim

RUN apt-get update && apt-get install -y \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY console/target/higress-console.jar /app
COPY start.sh /app

ARG TARGETARCH
COPY tools/mcp/${TARGETARCH}/main /app/tools/mcp/
COPY tools/mcp/openapiToMcpserver.sh /app/tools/mcp/
RUN chmod +x /app/tools/mcp/openapiToMcpserver.sh

EXPOSE 8080
CMD ["/app/start.sh"]