// docker-compose -f docker-compose.dev.yml exec mongodb mongo /docker-entrypoint-initdb.d/mongo-init.js
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
    partialFilterExpression: { email: { $type: 'string' } },
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
