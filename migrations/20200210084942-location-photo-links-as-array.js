module.exports = {
  async up(db) {
    const locations = await db.collection('locations').find({}).toArray();

    await Promise.all(locations.map(async (location) => {
      await db.collection('locations').updateOne(
        {_id: location._id},
        {
          $set: {
            photoLinks: location.photoLinks.split('\n').map(link => link.trim()).filter(link => link)
          }
        }
      )
    }));
  },

  async down(db) {
    const locations = await db.collection('locations').find({}).toArray();

    await Promise.all(locations.map(async (location) => {
      await db.collection('locations').updateOne(
        {_id: location._id},
        {
          $set: {
            photoLinks: location.photoLinks.join('\n')
          }
        }
      )
    }));
  }
};
