// 'use strict'
// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.createTable('Trucks', {
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
//       number:{
//         type:Sequelize.INTEGER,
//         allowNull: false,
//         unique: true
//       },
//       year: {
//         type: Sequelize.STRING, 
//         allowNull: false
//       },
//       make: {
//         type: Sequelize.STRING, 
//         allowNull: false
//       },
//       model: {
//         type: Sequelize.STRING, 
//         allowNull: false
//       }
//     });
//   },
//   down: (queryInterface, Sequelize) => {
//     return queryInterface.dropTable('Trucks');
//   }
// };
