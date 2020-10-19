#!/bin/bash

if [ $# -ne 2 ]; then
    echo "You must enter exactly 2 command line arguments: env name (prod or dev) and dump filename"
    exit 1
fi

cat "$2" | docker-compose -f "./docker-compose.$1.yml" exec -T mongodb mongorestore --archive --drop
