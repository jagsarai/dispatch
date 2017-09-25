'use strict';
module.exports = (sequelize, DataTypes) => {
  const Truck = sequelize.define('Truck', {
    number: {
      type: DataTypes.INTEGER, 
      allowNull: false, 
      unique: true,
      validate: {
        isNumeric: true
      }
    },
    year: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    make: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    model: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  Truck.associate = (models) =>{
    Truck.hasMany(models.Load, {
    })
  }
  return Truck;
};