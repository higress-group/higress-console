#!/bin/sh
echo $1
if [ "$1" = "--local" ]
then
    java $JVM_ARGS -jar ./console/target/higress-console.jar
else
    java $JVM_ARGS -jar /app/higress-console.jar
fi