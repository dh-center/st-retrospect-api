/**
 * Initialises necessary MongoDB indexes
 * See README.md#Database for more info
 */

db = db.getSiblingDB('retrospect');

db.getCollectionNames().forEach(function (collName) {
  db.runCommand({
    dropIndexes: collName,
    index: '*',
  });
});

db.createView('location_instances_denormalized', 'location_instances', [
  {
    '$lookup': {
      'from': 'locationtypes',
      'localField': 'locationTypesId',
      'foreignField': '_id',
      'as': 'locationTypes'
    }
  },
  {
    '$lookup': {
      'from': 'locationstyles',
      'localField': 'locationStyleId',
      'foreignField': '_id',
      'as': 'locationStyle'
    }
  },
  {'$unwind': {'path': '$locationStyle', 'preserveNullAndEmptyArrays': true}},
  {
    '$lookup': {
      'from': 'tags',
      'localField': 'tagIds',
      'foreignField': '_id',
      'as': 'tags'
    }
  },
  {
    '$lookup': {
      'from': 'locations',
      'localField': 'locationId',
      'foreignField': '_id',
      'as': 'location'
    }
  },
  {'$unwind': {'path': '$location'}},
])


db.createView('locations_denormalized', 'location_instances', [
  {
    '$lookup': {
      'from': 'locationtypes',
      'localField': 'locationTypesId',
      'foreignField': '_id',
      'as': 'locationTypes'
    }
  },
  {
    '$lookup': {
      'from': 'locationstyles',
      'localField': 'locationStyleId',
      'foreignField': '_id',
      'as': 'locationStyle'
    }
  },
  {'$unwind': {'path': '$locationStyle', 'preserveNullAndEmptyArrays': true}}, {
    '$lookup': {
      'from': 'tags',
      'localField': 'tagIds',
      'foreignField': '_id',
      'as': 'tags'
    }
  },
  {'$group': {'_id': '$locationId', 'instances': {'$push': '$$ROOT'}}},
  {
    '$lookup': {
      'from': 'locations',
      'localField': '_id',
      'foreignField': '_id',
      'as': 'parent'
    }
  },
  {'$unwind': {'path': '$parent'}},
  {'$replaceRoot': {'newRoot': {'$mergeObjects': ['$$ROOT', '$parent']}}},
  {'$project': {'parent': 0}}
])

printjson(db.users.createIndex(
  {email: 1},
  {
    unique: true,
    partialFilterExpression: {email: {$type: 'string'}},
  })
);

printjson(db.users.createIndex(
  {username: 1},
  {
    unique: true,
    partialFilterExpression: {username: {$type: 'string'}},
  })
);

printjson(db.users.createIndex(
  {'auth.google.id': 1},
  {
    unique: true,
    partialFilterExpression: {'auth.google.id': {$type: 'string'}},
  })
);

printjson(db.users.getIndexes());
