#! /bin/bash

OUTPUT=${1:-directory-index}
echo Creating index at $OUTPUT

lein run \
    --config config.json \
    --output $OUTPUT
