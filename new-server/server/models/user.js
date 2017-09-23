'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    role: {type: DataTypes.ENUM, values:['admin', 'driver'], allowNull: false, defaultValue: 'driver'},
    phone: {type: DataTypes.BIGINT, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
  });

  User.associate = (models) =>{
    User.hasMany(models.Load, {
    })
  }
  return User;
};