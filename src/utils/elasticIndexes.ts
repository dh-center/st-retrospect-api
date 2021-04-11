const esIndexPrefix = process.env.ELASTICSEARCH_INDEX_PREFIX || 'retrospect';

const elasticIndexes = {
  locationInstances: `${esIndexPrefix}.location_instances`,
};

export default elasticIndexes;
