'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Loads', [
      {
        "UserId": 2,
        "ShipperId": 1,
        "ReceiverId": 1,
        "TruckId": 1,
        "pickupDate": new Date(),
        "pickupTime": "18:00",
        "deliveryDate": new Date(),
        "deliveryTime": "00:02",
        "status": "assigned",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "UserId": 1,
        "ShipperId": 2,
        "ReceiverId": 2,
        "TruckId": 2,
        "pickupDate": new Date(),
        "pickupTime": "18:00",
        "deliveryDate": new Date(),
        "deliveryTime": "00:02",
        "status": "assigned",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "UserId": 3,
        "ShipperId": 3,
        "ReceiverId": 3,
        "TruckId": 3,
        "pickupDate": new Date(),
        "pickupTime": "18:00",
        "deliveryDate": new Date(),
        "deliveryTime": "00:02",
        "status": "assigned",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "UserId": 4,
        "ShipperId": 4,
        "ReceiverId": 4,
        "TruckId": 4,
        "pickupDate": new Date(),
        "pickupTime": "18:00",
        "deliveryDate": new Date(),
        "deliveryTime": "00:02",
        "status": "assigned",
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Loads', null, {});
  }
};