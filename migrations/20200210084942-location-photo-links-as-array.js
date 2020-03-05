module.exports = {
  async up(db) {
    const locations = await db.collection('locations').find({}).toArray();

    await Promise.all(locations.map(async (location) => {
      let photoArray = [];

      if (location.photoLinks) {
        photoArray = location.photoLinks.split('\n').map(link => link.trim()).filter(link => link);
      }

      await db.collection('locations').updateOne(
        { _id: location._id },
        {
          $set: {
            photoLinks: photoArray
          }
        }
      );
    }));
  },

  async down(db) {
    const locations = await db.collection('locations').find({}).toArray();

    await Promise.all(locations.map(async (location) => {
      await db.collection('locations').updateOne(
        { _id: location._id },
        {
          $set: {
            photoLinks: location.photoLinks.join('\n')
          }
        }
      );
    }));
  }
};
