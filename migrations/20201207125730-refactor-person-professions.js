const asyncForEach = require('./utils/asyncForEach');

module.exports = {
  async up(db, client) {
    console.log('20201207125730-refactor-person-professions:up');
    const persons = await db.collection('persons').find({}).toArray();

    await asyncForEach(persons, async (person) => {
      console.log(`\tprocess person with id ${person._id}`);
      const professions = person.professions || [];
      const professionsRu = professions.map(profession => profession.ru).filter(Boolean)
      const professionsEn = professions.map(profession => profession.en).filter(Boolean)
      const newProfessions = {
        ru: professionsRu,
        en: professionsEn
      };

      await db.collection('persons').updateOne({ _id: person._id }, {
        $set: {
          professions: newProfessions,
        },
      });
    });
  },

  async down(db, client) {
    console.log('20201207125730-refactor-person-professions:down');
    const persons = await db.collection('persons').find({}).toArray();

    await asyncForEach(persons, async (person) => {
      console.log(`\tprocess person with id ${person._id}`);
      const professions = person.professions || {ru: [], en: []}
      const length = Math.max(professions.en.length, professions.ru.length)

      const newProfessions = []

      for (let i = 0; i < length; i++) {
        newProfessions.push({
          ru: professions.ru && professions.ru[i],
          en: professions.en && professions.en[i]
        })
      }

      await db.collection('persons').updateOne({ _id: person._id }, {
        $set: {
          professions: newProfessions,
        },
      });
    });
  }
};
