#!/bin/sh
echo "$1"
if [ "$(uname -m)" = "arm64" ]  && ([ "$MACOS_COMPATIBLE" = "true" ] || [ "$MACOS_COMPATIBLE" = "1" ])
then
    JVM_ARGS="$JVM_ARGS -XX:+UnlockDiagnosticVMOptions -XX:-UseAESCTRIntrinsics -XX:UseSVE=0"
fi
echo "JVM_ARGS=$JVM_ARGS"
if [ "$1" = "--local" ]
then
    java $JVM_ARGS -jar ./console/target/higress-console.jar
else
    java $JVM_ARGS -jar /app/higress-console.jar
fi