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
      allowNull: false
    },
    ShipperId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Shippers',
        key: 'id',
        as: 'shipperId'
      },
      allowNull: false
    },
    ReceiverId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Receivers',
        key: 'id',
        as: 'receiverId'
      },
      allowNull: false
    },
    TruckId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Trucks',
        key: 'id',
        as: 'truckId'
      },
      allowNull: false
    }
  });

  Load.associate = (models) => {
    Load.belongsTo(models.User, {
      as: 'driver',
      foreignKey: 'UserId',
    })
  }

  return Load;
};