module.exports = {
  async up(db) {
    const persons = await db.collection('persons').find({}).toArray();

    await Promise.all(persons.map(async (person) => {
      let photoArray = [];

      if (person.photoLinks){
        photoArray = person.photoLinks.split('\n').map(link => link.trim()).filter(link => link)
      }

      await db.collection('persons').updateOne(
        {_id: person._id},
        {
          $set: {
            photoLinks: photoArray
          }
        }
      )
    }));
  },

  async down(db) {
    const persons = await db.collection('persons').find({}).toArray();

    await Promise.all(persons.map(async (person) => {
      await db.collection('persons').updateOne(
        {_id: person._id},
        {
          $set: {
            photoLinks: person.photoLinks.join('\n')
          }
        }
      )
    }));
  }
};
