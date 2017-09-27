// 'use strict';

// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.createTable('Shippers', {
//       id:{
//         type: Sequelize.INTEGER, 
//         primaryKey: true, 
//         autoIncrement: true, 
//         allowNull: false
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       name: {
//         type: Sequelize.STRING, 
//         allowNull: false,
//       },
//       address: {
//         type: Sequelize.STRING, 
//         allowNull: false,
//         unique: true
//       },
//       city: {
//         type: Sequelize.STRING, 
//         allowNull: false
//       },
//       state: {
//         type: Sequelize.STRING, 
//         allowNull: false
//       },    
//       zipCode: {
//         type: Sequelize.INTEGER, 
//         allowNull: false
//       }, 
//     });
//   },
//   down: (queryInterface, Sequelize) => {
//     return queryInterface.dropTable('Shippers');
//   }
// };
