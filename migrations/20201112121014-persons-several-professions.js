const asyncForEach = require('./utils/asyncForEach');

module.exports = {
  async up(db, client) {
    const persons = await db.collection('persons').find({}).toArray();

    await asyncForEach(persons, async (person) => {
      console.log(`\tprocess person with id ${person._id}`);

      await db.collection('persons').updateOne({ _id: person._id }, {
        $set: {
          professions: [person.profession],
        },
        $unset: {
          profession: '',
        }
      });
    });
  },

  async down(db, client) {
    const persons = await db.collection('persons').find({}).toArray();

    await asyncForEach(persons, async (person) => {
      console.log(`\tprocess person with id ${person._id}`);

      await db.collection('persons').updateOne({ _id: person._id }, {
        $set: {
          profession: person.professions[0],
        },
        $unset: {
          professions: []
        }
      });
    });
  }
};
