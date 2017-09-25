'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reciever = sequelize.define('Reciever', {
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

  Reciever.associate = (models) =>{
    Reciever.hasMany(models.Load, {
    })
  }
  return Reciever;
};