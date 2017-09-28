'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Receivers', [
      {
        "name": "receiver 1",
        "address": "1 receiver way",
        "city": "new city",
        "state": "OR",
        "zipCode": 92345,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "receiver 2",
        "address": "2 receiver rd",
        "city": "new city",
        "state": "OR",
        "zipCode": 92340,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "receiver 3",
        "address": "30 new dr",
        "city": "old city",
        "state": "OR",
        "zipCode": 92341,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "receiver 4",
        "address": "4 receiver ave",
        "city": "city",
        "state": "OR",
        "zipCode": 92342,
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Receivers', null, {});
  }
};
