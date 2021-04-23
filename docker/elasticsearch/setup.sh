#!/bin/bash

endpoint=${1:-'http://localhost:9200'}

index_prefix=${2:-'retrospect'}

curl -XDELETE "${endpoint}/${index_prefix}.*"

curl -XPUT -H 'Content-Type: application/json' "${endpoint}/${index_prefix}.locations" -d @./indexes/locations.json

curl -XPUT -H 'Content-Type: application/json' "${endpoint}/${index_prefix}.location_instances" -d @./indexes/location_instances.json
