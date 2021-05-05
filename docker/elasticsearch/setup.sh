#!/bin/bash

endpoint=${ELASTICSEARCH_ENDPOINT:-'http://localhost:9200'}

index_prefix=${ELASTICSEARCH_INDEX_PREFIX:-'retrospect'}

curl -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" -XDELETE "${endpoint}/${index_prefix}.*"

curl -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" -XPUT -H 'Content-Type: application/json' "${endpoint}/${index_prefix}.locations" -d @./indexes/locations.json

curl -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" -XPUT -H 'Content-Type: application/json' "${endpoint}/${index_prefix}.location_instances" -d @./indexes/location_instances.json
