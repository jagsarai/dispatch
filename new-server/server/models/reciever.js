'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reciever = sequelize.define('Reciever', {
    name: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    city: {type: DataTypes.STRING, allowNull: false},
    state: {type: DataTypes.STRING, allowNull: false},    
    zipCode: {type: DataTypes.INTEGER, allowNull: false},        
  });

  Reciever.associate = (models) =>{
    Reciever.hasMany(models.Load, {
    })
  }
  return Reciever;
};