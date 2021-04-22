const esIndexPrefix = process.env.ELASTICSEARCH_INDEX_PREFIX || 'retrospect';

const elasticIndexes = {
  locations: `${esIndexPrefix}.locations`,
};

export default elasticIndexes;
