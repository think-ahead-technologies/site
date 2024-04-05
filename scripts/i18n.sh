#!/bin/bash

# Cycle through every page within en/ and ensure de/ contains an identical file

cd src/pages
find en | cut -c 4- | while read f; do
    if [ -z "$f" ] || [ -d "en/$f" ]; then
        continue
    fi
    if ! diff -q "en/$f" "de/$f" >/dev/null 2>&1; then
        echo "COPYING en/$f -> de/$f"
        mkdir -p $(dirname "de/$f")
        cp -p "en/$f" "de/$f"
    fi
done