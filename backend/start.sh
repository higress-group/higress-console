#!/bin/sh
echo $1
if [ "$1" = "--local" ]
then
    java $JVM_ARGS -jar ./target/higress-console-0.0.1-SNAPSHOT.jar
else
    java $JVM_ARGS -jar /app/higress-console-0.0.1-SNAPSHOT.jar
fi