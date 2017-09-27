// 'use strict';
// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.createTable('Loads', {
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
//       UserId: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: 'Users',
//           key: 'id',
//           as: 'userId'
//         },
//       },
//       ShipperId: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: 'Shippers',
//           key: 'id',
//           as: 'shipperId'
//         },
//       },
//       RecieverId: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: 'Recievers',
//           key: 'id',
//           as: 'recieverId'
//         },
//       },
//       TruckId: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: 'Trucks',
//           key: 'id',
//           as: 'truckId'
//         },
//       }
//     });
//   },
//   down: (queryInterface, Sequelize) => {
//     return queryInterface.dropTable('Loads');
//   }
// };