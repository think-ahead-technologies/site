#!/bin/bash

# Cycle through every page within the base site and ensure the secondary
# language copy of the site contains an identical file.

SECONDARY_LANGUAGE=de

cd src/pages
find . | cut -c 3- | grep -vE "^$SECONDARY_LANGUAGE" | while read f; do
    if [ -z "$f" ] || [ -d "$f" ]; then
        continue
    fi
    if ! diff -q "$f" "$SECONDARY_LANGUAGE/$f" >/dev/null 2>&1; then
        echo "COPYING $f -> $SECONDARY_LANGUAGE/$f"
        mkdir -p $(dirname "$SECONDARY_LANGUAGE/$f")
        cp -p "$f" "$SECONDARY_LANGUAGE/$f"
    fi
done