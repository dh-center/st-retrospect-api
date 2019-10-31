const { MongoClient } = require('mongodb');
const mysql = require('mysql');
const asyncForEach = require('./asyncForEach');
const saveImage = require('./saveImage');
const connectionConfig = {
  useNewUrlParser: true,
  reconnectTries: +(process.env.MONGO_RECONNECT_TRIES || 60),
  reconnectInterval: +(process.env.MONGO_RECONNECT_INTERVAL || 1000),
  autoReconnect: true,
  useUnifiedTopology: true
};

const mySqlConnection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'dhlab_map',
  password: 'secret',
  database: 'dhlab_map'
});

let mongoConnection;
const relationTypesMap = new Map();
const locationTypesMap = new Map();
const addressesMap = new Map();
const personsMap = new Map();
const locationsMap = new Map();

async function getConnection() {
  if (!mongoConnection) {
    mongoConnection = (await MongoClient.connect('mongodb://localhost:27017/db-interface', connectionConfig)).db();
  }
  return mongoConnection;
}

function setupMySqlConnection() {
  return new Promise((resolve, reject) => {
    mySqlConnection.connect((err) => {
      if (err) reject(err);
      console.log('MySQL connected');
      resolve();
    });
  });
}

function insertToSql(tableName, data) {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(`INSERT INTO ${tableName} SET ?`, data, function (err, results) {
      if (err) reject(err);
      resolve(results);
    });
  });
}

async function importRelationTypes() {
  let relations = await mongoConnection.collection('relationtypes').find({}).toArray();

  relations = relations.map(async relation => {
    /*
     * console.log(relation._id)
     * console.log(relation.name)
     */
    const dataRu = {
      name: relation.name.ru,
      active: 1
    };

    const result = await insertToSql('relation_types', dataRu);

    relationTypesMap.set(relation._id.toString(), result.insertId);
    if (relation.name.en) {
      const dataEn = {
        name: relation.name.en,
        relation_type_id: result.insertId,
        locale: 'en'
      };

      await insertToSql('relation_types_translations', dataEn);
    }

    await asyncForEach(relation.synonyms, async syn => {
      if (!syn.name || !syn.name.ru) {
        return;
      }
      const synonymRu = {
        name: syn.name.ru,
        relation_type_id: result.insertId
      };

      const result1 = await insertToSql('relation_synonums', synonymRu);

      if (syn.name.en) {
        const synonymEn = {
          name: syn.name.en,
          locale: 'en',
          relation_synonum_id: result1.insertId
        };

        await insertToSql('relation_synonums_translations', synonymEn);
      }
    });
  });
  await Promise.all(relations);
}

async function importLocationTypes() {
  const locationTypes = await mongoConnection.collection('locationtypes').find({}).toArray();

  await asyncForEach(locationTypes, async locationType => {
    const dataRu = {
      name: locationType.name.ru
    };

    const result = await insertToSql('building_types', dataRu);

    locationTypesMap.set(locationType._id.toString(), result.insertId);
    if (locationType.name.en) {
      const dataEn = {
        name: locationType.name.en,
        building_type_id: result.insertId,
        locale: 'en'
      };

      await insertToSql('building_types_translations', dataEn);
    }
  });
}

async function importAddresses() {
  const addresses = await mongoConnection.collection('addresses').find({}).toArray();

  await asyncForEach(addresses, async address => {
    const dataRu = {
      street_name: address.street.ru,
      house_number: address.homeNumber,
      courpus: address.housing,
      build: address.build && address.build.ru,
      street_link: address.link,
      active: 1
    };

    const result = await insertToSql('addresses', dataRu);

    addressesMap.set(address._id.toString(), result.insertId);
    if (address.street.en) {
      const dataEn = {
        address_id: result.insertId,
        street_name: address.street.en,
        house_number: address.homeNumber,
        courpus: address.housing,
        build: address.build && address.build.en,
        street_link: address.link,
        locale: 'en'
      };

      await insertToSql('addresses_translations', dataEn);
    }
  });
}

async function importPersons() {
  let i = 0;

  const persons = await mongoConnection.collection('persons').find({}).toArray();

  await asyncForEach(persons, async person => {
    i++;
    // console.log('person', person._id, i);

    let uri;

    try {
      uri = decodeURI(person.wikiLink);
    } catch (e) {
      console.log(e);
      console.log('person', person._id);
    }
    const dataRu = {
      first_name: person.firstName && person.firstName.ru,
      last_name: (person.lastName && person.lastName.ru) || '',
      patronymic: person.patronymic && person.patronymic.ru,
      pseudonym: person.pseudonym && person.pseudonym.ru,
      birth_date: new Date(person.birthDate),
      death_date: new Date(person.deathDate),
      profession: person.profession && person.profession.ru,
      description: person.description && person.description.ru,
      link: uri,
      wikilink: uri,
      active: 1
    };

    const result = await insertToSql('persons', dataRu);

    personsMap.set(person._id.toString(), result.insertId);

    if (person.firstName.en) {
      const dataEn = {
        person_id: result.insertId,
        first_name: person.firstName && person.firstName.en,
        last_name: (person.lastName && person.lastName.en) || '',
        patronymic: person.patronymic && person.patronymic.en,
        pseudonym: person.pseudonym && person.pseudonym.en,
        profession: person.profession && person.profession.en,
        description: person.description && person.description.en,
        link: uri,
        wikilink: uri,
        locale: 'en'
      };

      await insertToSql('persons_translations', dataEn);
    }

    if (person.mainPhotoLink) {
      try {
        const filename = await saveImage(`./uploads/person-${result.insertId}-main`, person.mainPhotoLink);
        const imageData = {
          model_type: 'App\\Models\\Person',
          model_id: result.insertId,
          main: 1,
          link: filename.substring(1)
        };

        await insertToSql('photos', imageData);
      } catch (e) {
      }
    }

    if (person.photoLinks) {
      await Promise.all(person.photoLinks.split('\n').map(async (link, index) => {
        console.log('link', link);
        try {
          const filename = await saveImage(`./uploads/person-${result.insertId}-${index}`, link);
          const imageData = {
            model_type: 'App\\Models\\Person',
            model_id: result.insertId,
            main: 0,
            link: filename.substring(1)
          };

          await insertToSql('photos', imageData);
        } catch (e) {
        }
      }));
    }
  });
}

async function importLocations() {
  let i = 0;

  const locations = await mongoConnection.collection('locations').find({}).toArray();

  await asyncForEach(locations, async location => {
    i++;
    console.log('location', location._id, i, location.locationTypesId && location.locationTypesId[0] && location.locationTypesId[0].toString());
    let uri;

    try {
      uri = decodeURI(location.wikiLink);
    } catch (e) {
      console.log(e);
      console.log('location', location._id);
    }
    const dataRu = {
      name: (location.name && location.name.ru) || '',
      architects: (location.architects && location.architects.ru && JSON.stringify(location.architects.ru.split(','))) || undefined,
      construction_date: new Date(location.constructionDate),
      demolition_date: new Date(location.demolitionDate),
      building_type_id: locationTypesMap.get(location.locationTypesId && location.locationTypesId[0] && location.locationTypesId[0].toString()) || 1,
      description: location.description && location.description.ru,
      coord_lat: location.coordinateY,
      coord_lng: location.coordinateX,
      wikilink: uri,
      active: 1
    };

    const result = await insertToSql('locations', dataRu);

    locationsMap.set(location._id.toString(), result.insertId);
    if (location.name.en) {
      const dataEn = {
        name: (location.name && location.name.en) || '',
        location_id: result.insertId,
        description: location.description && location.description.en,
        wikilink: uri,
        locale: 'en'
      };

      await insertToSql('locations_translations', dataEn);
    }
    if (location.addressesId) {
      await Promise.all(location.addressesId.map(async address => {
        const addressId = addressesMap.get(address && address.toString());
        const data = {
          location_id: result.insertId,
          address_id: addressId
        };

        if (addressId) {
          await insertToSql('location_address', data);
        }
      }));
    }
    if (location.mainPhotoLink) {
      try {
        const filename = await saveImage(`./uploads/location-${result.insertId}-main`, location.mainPhotoLink);
        const imageData = {
          model_type: 'App\\Models\\Location',
          model_id: result.insertId,
          main: 1,
          link: filename.substring(1)
        };

        await insertToSql('photos', imageData);
      } catch (e) {
      }
    }

    if (location.photoLinks) {
      await Promise.all(location.photoLinks.split('\n').map(async (link, index) => {
        console.log('link', link);
        try {
          const filename = await saveImage(`./uploads/location-${result.insertId}-${index}`, link);
          const imageData = {
            model_type: 'App\\Models\\Location',
            model_id: result.insertId,
            main: 0,
            link: filename.substring(1)
          };

          await insertToSql('photos', imageData);
        } catch (e) {
        }
      }));
    }
  });
}

async function importRelations() {
  console.log('import relations');
  const relations = await mongoConnection.collection('relations').find({}).toArray();

  await asyncForEach(relations, async relation => {
    // console.log('relation', relation._id);
    const location = locationsMap.get(relation.locationId.toString());
    const relationType = relationTypesMap.get(relation.relationId.toString());
    const person = personsMap.get(relation.personId.toString());

    if (!(location && relationType && person)) {
      return;
    }

    const dataRu = {
      location_id: location,
      relation_type_id: relationType,
      person_id: person,
      quote: relation.quote && relation.quote.ru,
      active: 1
    };

    const result = await insertToSql('person_location_relation', dataRu);

    if (relation.quote && relation.quote.en) {
      const dataEn = {
        quote: relation.quote.en,
        relation_id: result.insertId,
        locale: 'en'
      };

      await insertToSql('relation_translations', dataEn);
    }
  });
}

async function main() {
  mongoConnection = await getConnection();
  await setupMySqlConnection();

  await Promise.all([
    importRelationTypes(),
    importLocationTypes(),
    importAddresses()
  ]);

  await Promise.all([
    importPersons(),
    importLocations()
  ]);
  await importRelations();
}

main()
  .catch(err => console.log(err))
  .finally(() => process.exit());
