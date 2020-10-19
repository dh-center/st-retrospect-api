const asyncForEach = require('./utils/asyncForEach');

module.exports = {
  async up(db, client) {
    const locations = await db.collection('locations').find({}).toArray()

    await asyncForEach(locations, async (location) => {
      console.log(`process location with id ${location._id}`)
      if (!location.addressesId && location.addressesId.length === 0) {
        return;
      }

      const addresses = await db.collection('addresses').find({_id: {
          $in: location.addressesId
        }}).toArray();
      const newAddresses = addresses.map(address => ({
          /**
           * Country data
           */
          countryCode: 'RU',

          /**
           * Country region data
           */
          regionCode: 'RU-SPE',

          /**
           * City name, e.g. Saint-Petersburg
           */
          place: {
            en: 'Saint-Petersburg',
            ru: 'Санкт-Петербург',
          },

          /**
           * The first line of an address e.g. Пл. Никольская 1
           */
          address: {
            ru: (address.street.ru + ', ' + address.homeNumber).trim()
          },
        }
      ))

      await db.collection('locations').updateOne({_id: location._id},
        {
          $set: {
            addresses: newAddresses
          },
          $unset: {
            addressesId: ''
          }
        })
    })

    await db.collection('addresses').drop();
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
