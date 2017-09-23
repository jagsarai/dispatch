'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shipper = sequelize.define('Shipper', {
    name: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    city: {type: DataTypes.STRING, allowNull: false},
    state: {type: DataTypes.STRING, allowNull: false},    
    zipCode: {type: DataTypes.INTEGER, allowNull: false},        
  });

  Shipper.associate = (models) =>{
    Shipper.hasMany(models.Load, {
    })
  }
  return Shipper;
};