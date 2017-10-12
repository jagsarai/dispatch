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
    },
    pickupDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    pickupTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    deliveryTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values:['assigned', 'dispatched', 'at shipper', 'loaded', 'en route', 'at receiver', 'delivered', 'completed' ], 
      allowNull: false, 
      defaultValue: 'assigned'
    },
    filesUploaded:{
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    },
    filesData:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
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