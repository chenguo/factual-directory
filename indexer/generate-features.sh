#! /bin/bash

OUTPUT=features.json
echo Creating $OUTPUT

lein run -m indexer.featurizer \
    --config config.json \
    --output $OUTPUT
