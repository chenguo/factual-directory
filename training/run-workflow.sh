#! /bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
set -a
source $DIR/profile
set +a

drake -w train-search.d --base $DIR/runs/$RUN_NAME $@

