const { ObjectId } = require('mongodb');
const asyncForEach = require('./utils/asyncForEach');

module.exports = {
  async up(db) {
    const locations = await db.collection('locations').find({}).toArray();

    await asyncForEach(locations, async (location) => {
      const locationInstanceId = (await db.collection('location_instances').insertOne(
        {
          name: location.name,
          locationId: location._id,
          description: location.description,
          wikiLink: location.wikiLink,
          locationTypesId: location.locationTypesId,
          photoLinks: location.photoLinks,
          mainPhotoLink: location.mainPhotoLink,
          constructionDate: location.constructionDate,
          demolitionDate: location.demolitionDate,
          startDate: location.constructionDate,
          endDate: location.demolitionDate
        }
      )).insertedId;

      await db.collection('locations').updateOne(
        { _id: location._id },
        {
          $set: {
            locationInstanceIds: [ locationInstanceId ]
          },
          $unset: {
            name: '',
            description: '',
            wikiLink: '',
            locationTypesId: '',
            photoLinks: '',
            mainPhotoLink: '',
            constructionDate: '',
            demolitionDate: ''
          }
        }
      );

      const relations = await db.collection('relations').find({
        locationId: location._id
      }).toArray();

      if (relations[0]) {
        await Promise.all(relations.map(relation =>
          db.collection('relations').updateOne({ _id: relation._id }, { $set: { locationId: locationInstanceId } })
        ));
      }

      const routes = await db.collection('routes').find({
        locationIds: location._id
      }).toArray();

      if (routes[0]) {
        await Promise.all(routes.map(route => {
          const newLocationIds = route.locationIds.map(
            locationId =>
              (locationId.toString() === location._id.toString()) ? locationInstanceId : locationId
          );

          return db.collection('routes').updateOne({ _id: route._id }, { $set: { locationIds: newLocationIds } });
        }));
      }
    });

    await db.collection('routes').updateMany({}, { $rename: { locationIds: 'locationInstanceIds' } });
    await db.collection('relations').updateMany({}, { $rename: { locationId: 'locationInstanceId' } });
  }
};
