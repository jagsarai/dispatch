'use strict';
var bcypt = require('bcrypt-node');
var saltNum = require('../config/salt').SALT_WORK_FACTOR;

var salt = bcypt.genSalt(saltNum,(err, salt) => {
    console.log("salt is " + salt);
    return salt;
})


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        "name": "Admin",
        "email": "admin@gmail.com",
        "phone": 123466899,
        "role": "admin",
        "password": bcypt.hashSync("password", salt),
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Driver 1",
        "email": "driver1@gmail.com",
        "phone": 1234567890,
        "role": "driver",
        "password": bcypt.hashSync("password", salt),
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Driver 2",
        "email": "driver2@gmail.com",
        "phone": 1234567891,
        "role": "driver",
        "password": bcypt.hashSync("password", salt),
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Driver 3",
        "email": "driver3@gmail.com",
        "phone": 1234567892,
        "role": "driver",
        "password": bcypt.hashSync("password", salt),
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
