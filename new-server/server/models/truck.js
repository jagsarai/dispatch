'use strict';
module.exports = (sequelize, DataTypes) => {
  const Truck = sequelize.define('Truck', {
    number: {type: DataTypes.INTEGER, allowNull: false},
    year: {type: DataTypes.STRING, allowNull: false},
    make: {type: DataTypes.STRING, allowNull: false},
    model: {type: DataTypes.STRING, allowNull: false}
  });

  Truck.associate = (models) =>{
    Truck.hasMany(models.Load, {
    })
  }
  return Truck;
};