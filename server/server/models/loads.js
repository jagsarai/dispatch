'use strict';
module.exports = (sequelize, DataTypes) => {
  const Load = sequelize.define('Load', {
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      },
    },
    ShipperId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Shippers',
        key: 'id',
        as: 'shipperId'
      },
    },
    RecieverId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Recievers',
        key: 'id',
        as: 'recieverId'
      },
    },
    TruckId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Trucks',
        key: 'id',
        as: 'truckId'
      },
    }
  });

  Load.associate = (models) => {
    Load.belongsTo(models.User, {
      as: 'driver',
      foreignKey: 'UserId',
      unique: true
    })
  }

  return Load;
};