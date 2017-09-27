'use strict';
module.exports = (sequelize, DataTypes) => {
  const Receiver = sequelize.define('Receiver', {
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
        notEmpty: true
      }
    },        
  });

  Receiver.associate = (models) =>{
    Receiver.hasMany(models.Load, {
    })
  }
  return Receiver;
};