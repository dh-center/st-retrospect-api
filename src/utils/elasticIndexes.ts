const esIndexPrefix = process.env.ELASTICSEARCH_INDEX_PREFIX || 'retrospect';

const elasticIndexes = {
  locationsView: `${esIndexPrefix}.locations_view`,
};

export default elasticIndexes;
