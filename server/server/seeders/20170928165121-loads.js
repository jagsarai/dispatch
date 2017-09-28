'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Loads', [
      {
        "UserId": 2,
        "ShipperId": 1,
        "ReceiverId": 1,
        "TruckId": 1,
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Loads', null, {});
  }
};