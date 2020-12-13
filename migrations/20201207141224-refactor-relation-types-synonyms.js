const asyncForEach = require('./utils/asyncForEach');

module.exports = {
  async up(db, client) {
    console.log('20201207141224-refactor-relation-types-synonyms:up');
    const relationTypes = await db.collection('relationtypes').find({}).toArray();

    await asyncForEach(relationTypes, async (person) => {
      console.log(`\tprocess relation type with id ${person._id}`);
      const synonyms = person.synonyms || [];
      const synonymsRu = synonyms.map(profession => profession && profession.ru).filter(Boolean)
      const synonymsEn = synonyms.map(profession => profession && profession.en).filter(Boolean)
      const newSynonyms = {
        ru: synonymsRu,
        en: synonymsEn
      };

      await db.collection('relationtypes').updateOne({ _id: person._id }, {
        $set: {
          synonyms: newSynonyms,
        },
      });
    });
  },

  async down(db, client) {
    console.log('20201207141224-refactor-relation-types-synonyms:down');
    const relationTypes = await db.collection('relationtypes').find({}).toArray();

    await asyncForEach(relationTypes, async (person) => {
      console.log(`\tprocess relation type with id ${person._id}`);
      const synonyms = person.synonyms || {ru: [], en: []}
      const length = Math.max(synonyms.en.length, synonyms.ru.length)

      const newSynonyms = []

      for (let i = 0; i < length; i++) {
        newSynonyms.push({
          ru: synonyms.ru && synonyms.ru[i],
          en: synonyms.en && synonyms.en[i]
        })
      }

      await db.collection('relationtypes').updateOne({ _id: person._id }, {
        $set: {
          synonyms: newSynonyms,
        },
      });
    });
  }
};
