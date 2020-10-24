const asyncForEach = require('./utils/asyncForEach');

module.exports = {
  async up(db, client) {
    const relationTypes = await db.collection('relationtypes').find({}).toArray();

    await asyncForEach(relationTypes, async (relationType) => {
      console.log(`\tprocess relation type with id ${relationType._id}`);
      relationType.synonyms = relationType.synonyms.map((synonym) => {
        if (!synonym) {
          return null;
        }

        return synonym.name;
      });

      await db.collection('relationtypes').updateOne({ _id: relationType._id }, {
        $set: {
          synonyms: relationType.synonyms,
        }
      });
    });
  },

  async down(db, client) {
    const relationTypes = await db.collection('relationtypes').find({}).toArray();

    await asyncForEach(relationTypes, async (relationType) => {
      console.log(`\tprocess relation type with id ${relationType._id}`);
      relationType.synonyms = relationType.synonyms.map((synonym) => {
        if (!synonym) {
          return null;
        }

        return {
          name: synonym,
        };
      });

      await db.collection('relationtypes').updateOne({ _id: relationType._id }, {
        $set: {
          synonyms: relationType.synonyms,
        }
      });
    });
  }
};
