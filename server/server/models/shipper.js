'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shipper = sequelize.define('Shipper', {
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    city: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },    
    zipCode: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },        
  });

  Shipper.associate = (models) =>{
    Shipper.hasMany(models.Load, {
    })
  }
  return Shipper;
};