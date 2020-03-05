const { ObjectId } = require('mongodb');

module.exports = {
  async up(db) {
    const locations = await db.collection('locations').find({}).toArray();

    await Promise.all(locations.map(async (location) => {
      const locationInstanceId = (await db.collection('location_instances').insertOne(
        {
          name: location.name,
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
    }));
  },

  async down(db, client) {
    /*
     * TODO write the statements to rollback your migration (if possible)
     * Example:
     * await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
     */
  }
};
