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
    '$addFields': {
      'yearMatch': {
        '$regexFind': {
          'input': '$startDate',
          'regex': new RegExp('\\d{4}')
        }
      }
    }
  }, {
    '$addFields': {
      'year': {
        '$toInt': '$yearMatch.match'
      }
    }
  }, {
    '$project': {
      'yearMatch': 0
    }
  },
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
    '$addFields': {
      'yearMatch': {
        '$regexFind': {
          'input': '$startDate',
          'regex': new RegExp('\\d{4}')
        }
      }
    }
  }, {
    '$addFields': {
      'year': {
        '$toInt': '$yearMatch.match'
      }
    }
  }, {
    '$project': {
      'source': 0,
      'yearMatch': 0
    }
  }, {
    '$lookup': {
      'from': 'locationtypes',
      'localField': 'locationTypesId',
      'foreignField': '_id',
      'as': 'locationTypes'
    }
  }, {
    '$lookup': {
      'from': 'locationstyles',
      'localField': 'locationStyleId',
      'foreignField': '_id',
      'as': 'locationStyle'
    }
  }, {
    '$unwind': {
      'path': '$locationStyle',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$lookup': {
      'as': 'tags',
      'from': 'tags',
      'localField': 'tagIds',
      'foreignField': '_id'
    }
  }, {
    '$group': {
      '_id': '$locationId',
      'instances': {
        '$push': '$$ROOT'
      }
    }
  }, {
    '$lookup': {
      'from': 'locations',
      'localField': '_id',
      'foreignField': '_id',
      'as': 'parent'
    }
  }, {
    '$unwind': {
      'path': '$parent'
    }
  }, {
    '$replaceRoot': {
      'newRoot': {
        '$mergeObjects': [
          '$$ROOT', '$parent'
        ]
      }
    }
  }, {
    '$project': {
      'parent': 0
    }
  }
])

db.createView('relations_denormalized', 'relations', [
  {
    '$lookup': {
      'from': 'persons',
      'localField': 'personId',
      'foreignField': '_id',
      'as': 'person'
    }
  }, {
    '$unwind': {
      'path': '$person',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$lookup': {
      'from': 'location_instances',
      'localField': 'locationInstanceId',
      'foreignField': '_id',
      'as': 'locationInstance'
    }
  }, {
    '$unwind': {
      'path': '$locationInstance',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$lookup': {
      'from': 'relationtypes',
      'localField': 'relationId',
      'foreignField': '_id',
      'as': 'relationType'
    }
  }, {
    '$unwind': {
      'path': '$relationType',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$addFields': {
      'startYearMatch': {
        '$regexFind': {
          'input': '$startDate',
          'regex': new RegExp('\\d{4}')
        }
      },
      'endYearMatch': {
        '$regexFind': {
          'input': '$endDate',
          'regex': new RegExp('\\d{4}')
        }
      }
    }
  }, {
    '$addFields': {
      yearsRange: {
        $cond: {
          if: {
            $and: [
              {$eq: ['$startYearMatch', null]},
              {$eq: ['$endYearMatch', null]}
            ]
          },
          then: null,
          else: {
            gte: {
              '$toInt': '$startYearMatch.match'
            },
            lte: {
              '$toInt': '$endYearMatch.match'
            }
          }
        }
      }
    }
  }, {
    '$project': {
      'endYearMatch': 0,
      'startYearMatch': 0
    }
  }
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
