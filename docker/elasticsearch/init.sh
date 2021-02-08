# Create db-interface.location_instances index
curl -XPUT "http://elastic-search:9200/db-interface.location_instances"

# Setup mappings for db-interface.location_instances index
curl -XPOST "http://elastic-search:9200/db-interface.location_instances/_mapping" -H 'Content-Type: application/json' -d'{  "properties": {    "name.ru":  {      "type": "text",      "analyzer":"russian"    },    "name.en":  {      "type": "text",      "analyzer":"russian"    },    "description.ru":  {      "type": "text",      "analyzer":"russian"    },    "description.en":  {      "type": "text",      "analyzer":"russian"    }  }}'
