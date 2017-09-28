'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Trucks', [
      {
        "number": 10,
        "year": "2009",
        "make": "peterbilt",
        "model": "2020", 
        "createdAt": new Date(),
        "updatedAt": new Date()     
      },
      {
        "number": 11,
        "year": "2010",
        "make": "kennworth",
        "model": "T680",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "number": 12,
        "year": "2011",
        "make": "freightliner",
        "model": "cascadia",
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "number": 13,
        "year": "2012",
        "make": "mack",
        "model": "truck",
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Trucks', null, {});
  }
};