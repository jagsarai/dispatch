// 'use strict';
// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.createTable('Users', {
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
//       phone:{
//         type:Sequelize.BIGINT,
//         allowNull: false,
//         unique: true
//       },
//       role: {
//         type: Sequelize.ENUM, 
//         values:['admin', 'driver'], 
//         allowNull: false, 
//         defaultValue: 'driver'
//       },
//       name: {
//         type: Sequelize.STRING, 
//         allowNull: false
//       },
//       email: {
//         type: Sequelize.STRING, 
//         allowNull: false,
//         unique: true
//       },
//       password: {
//         type: Sequelize.STRING, 
//         allowNull: false
//       },
//     });
//   },
//   down: (queryInterface, Sequelize) => {
//     return queryInterface.dropTable('Users');
//   }
// };