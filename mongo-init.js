/**
 * Initialises necessary MongoDB indexes
 * See README.md#Database for more info
 */

db = db.getSiblingDB('db-interface');

printjson(db.users.createIndex(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $type: 'string' } },
  })
);

printjson(db.users.createIndex(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: { username: { $type: 'string' } },
  })
);

printjson(db.users.createIndex(
  { 'auth.google.id': 1 },
  {
    unique: true,
    partialFilterExpression: { 'auth.google.id': { $type: 'string' } },
  })
);

printjson(db.users.getIndexes());
