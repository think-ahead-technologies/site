#!/bin/bash
set -o pipefail

command -v jq >/dev/null \
    || (echo "Error: jq required but absent." >&2 && false) \
    || exit 1

de=public/locales/de/translation.json
en=public/locales/en/translation.json

FLATTEN='. | [paths(scalars) as $path | {"key": $path | join("."), "value": getpath($path)}] | from_entries'
KEYS="$FLATTEN | keys"

common() {
    file1=$1
    file2=$2
    header=$3
    output=$(grep -Fxf <(jq -r "$FLATTEN" $file1) <(jq -r "$FLATTEN" $file2) \
        | tr -d '{}' | sed 's/,$//;/^$/d')
    if [ -n "$output" ]; then
        echo "$header"
        echo "$output"
        false
    fi
}

only() {
    file1=$1
    file2=$2
    header=$3
    output=$(grep -vFxf <(jq -r "$KEYS" $file1) <(jq -r "$KEYS" $file2) \
        | tr -d '" ,' | sed -e 's/^/- /')
    if [ -n "$output" ]; then
        echo "$header"
        echo "$output"
        echo
        false
    fi
}

changes=false

only $de $en "Paths that are missing in German:" || changes=true
only $en $de "Paths that are missing in English:" || changes=true

common $de $en "Paths with the same text in English and German:" || changes=true

if $changes; then
    exit 1
fi