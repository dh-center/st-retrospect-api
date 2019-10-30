const { MongoClient } = require('mongodb');
const asyncForEach = require('./asyncForEach');
const fs = require('fs');

const connectionConfig = {
  useNewUrlParser: true,
  reconnectTries: +(process.env.MONGO_RECONNECT_TRIES || 60),
  reconnectInterval: +(process.env.MONGO_RECONNECT_INTERVAL || 1000),
  autoReconnect: true,
  useUnifiedTopology: true
};

let mongoConnection;

async function getConnection() {
  if (!mongoConnection) {
    mongoConnection = (await MongoClient.connect('mongodb://localhost:27017/db-interface', connectionConfig)).db();
  }
  return mongoConnection;
}

function writeFile(filename, fileContent) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, fileContent, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

async function main() {
  mongoConnection = await getConnection();

  let fileContent = '"Широта";"Долгота";"Описание";"Подпись";"Номер метки"\n';

  const locations = await mongoConnection.collection('locations').find({}).toArray();

  let i = 1;

  locations.forEach(location => {
    if (!(location.coordinateY || location.coordinateX)) {
      // console.log(`https://db.st-retrospect.dh-center.ru/locations/${location._id}/edit`);
      return;
    }

    const locationRow = `${location.coordinateX};${location.coordinateY};${location._id.toString()};${location.name && location.name.ru};${i++}\n`;

    fileContent += locationRow;

  });
  console.log(fileContent);
  const filename = `locations.csv`;

  await writeFile(filename, fileContent);
}

main()
  .catch(err => console.log(err))
  .finally(() => process.exit());
