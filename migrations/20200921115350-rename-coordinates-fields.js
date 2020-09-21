module.exports = {
  async up(db, client) {
    db.collection('locations').updateMany({}, {
      $rename: {
        coordinateX: 'latitude',
        coordinateY: 'longitude'
      }
    })
  },

  async down(db, client) {
    db.collection('locations').updateMany({}, {
      $rename: {
        latitude: 'coordinateX',
        longitude: 'coordinateY'
      }
    })
  }
};
