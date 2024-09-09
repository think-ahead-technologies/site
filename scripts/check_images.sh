#!/bin/bash

# This script just detects any image files with large file sizes, measured
#  simply by the number of digits in the (bytes) file size.

image_files=public/*.jpg
max_size_digits=7

# combine image file sizes...
# ...with the names of the same files...
# ...then filter for only the large ones...
# and store their names.
too_big=$(paste \
    <(ls -lS $image_files | awk '{print $5}') \
    <(ls -S $image_files) \
    | grep -E "^[0-9]{$max_size_digits,}" \
    | awk '{print $2}')

if [ -z "$too_big" ]; then
    exit 0
fi

echo "The following images are a bit big. Please reduce their file size:" >&2
ls -lh $too_big >&2
exit 1