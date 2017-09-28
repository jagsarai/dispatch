'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Shippers', [
      {
        "name": "shipper 1",
        "address": "1 shippers way",
        "city": "new city",
        "state": "CA",
        "zipCode": 12345,
        "createdAt": new Date(),
        "updatedAt": new Date() 
      },
      {
        "name": "shipper 2",
        "address": "2 example rd",
        "city": "new city",
        "state": "CA",
        "zipCode": 12340,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "shipper 3",
        "address": "3 new dr",
        "city": "old city",
        "state": "CA",
        "zipCode": 12341,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "shipper 4",
        "address": "4 warehouse ave",
        "city": "city",
        "state": "state",
        "zipCode": 12342,
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Shippers', null, {});
  }
};