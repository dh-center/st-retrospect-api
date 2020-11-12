const asyncForEach = require('./utils/asyncForEach');

module.exports = {
  async up(db, client) {
    console.log('20201112121014-persons-several-professions:up');
    const persons = await db.collection('persons').find({}).toArray();

    await asyncForEach(persons, async (person) => {
      console.log(`\tprocess person with id ${person._id}`);
      const professionsRu = person.profession.ru ? person.profession.ru.split(',') : [];
      const professionsEn = person.profession.en ? person.profession.en.split(',') : [];
      let professions = [];

      for (let i = 0; i < (professionsRu.length > professionsEn.length ? professionsRu.length : professionsEn.length); i++) {
        professions.push({
          ru: professionsRu[i] ? professionsRu[i].trim() : '',
          en: professionsEn[i] ? professionsEn[i].trim() : '',
        });
      }

      await db.collection('persons').updateOne({ _id: person._id }, {
        $set: {
          professions: professions,
        },
        $unset: {
          profession: '',
        }
      });
    });
  },

  async down(db, client) {
    console.log('20201112121014-persons-several-professions:down');
    const persons = await db.collection('persons').find({}).toArray();

    await asyncForEach(persons, async (person) => {
      console.log(`\tprocess person with id ${person._id}`);

      let professions = {
        ru: '',
        en: '',
      };

      for (let profession of person.professions) {
        if (profession.ru && profession.ru.length !== 0) {
          professions.ru += profession.ru + ', ';
        }
        if (profession.en && profession.en.length !== 0) {
          professions.en += profession.en + ', ';
        }
      }

      if (professions.ru && professions.ru.length !== 0) {
        professions.ru = professions.ru.substring(0, professions.ru.length - 2);
      }
      if (professions.en && professions.en.length !== 0) {
        professions.en = professions.en.substring(0, professions.en.length - 2);
      }

      await db.collection('persons').updateOne({ _id: person._id }, {
        $set: {
          profession: professions,
        },
        $unset: {
          professions: []
        }
      });
    });
  }
};
