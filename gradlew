#!/bin/sh
set -e

GRADLE_VERSION="8.10.2"
GRADLE_DIR="$HOME/.gradle-wrapper/gradle-$GRADLE_VERSION"
GRADLE_BIN="$GRADLE_DIR/bin/gradle"
GRADLE_ZIP_URL="https://services.gradle.org/distributions/gradle-$GRADLE_VERSION-bin.zip"

if [ ! -x "$GRADLE_BIN" ]; then
  mkdir -p "$HOME/.gradle-wrapper"
  TMP_ZIP="$HOME/.gradle-wrapper/gradle-$GRADLE_VERSION-bin.zip"
  if [ ! -f "$TMP_ZIP" ]; then
    curl -fsSL "$GRADLE_ZIP_URL" -o "$TMP_ZIP"
  fi
  rm -rf "$GRADLE_DIR"
  mkdir -p "$GRADLE_DIR"
  (cd "$HOME/.gradle-wrapper" && jar xf "gradle-$GRADLE_VERSION-bin.zip")
  chmod +x "$GRADLE_BIN"
fi

exec "$GRADLE_BIN" "$@"
