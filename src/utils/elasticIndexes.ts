const esIndexPrefix = process.env.ELASTICSEARCH_INDEX_PREFIX || 'retrospect';

const elasticIndexes = {
  locations: `${esIndexPrefix}.locations`,
  locationInstances: `${esIndexPrefix}.location_instances`,
};

export default elasticIndexes;
