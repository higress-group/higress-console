#!/bin/sh
./mvnw clean package -Dmaven.test.skip=true
docker build -t higress-console:0.0.1 -f Dockerfile .