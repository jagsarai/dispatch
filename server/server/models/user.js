'use strict';
var bcrypt = require('bcrypt-node');
var saltNum = require('../config/salt').SALT_WORK_FACTOR;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    role: {
      type: DataTypes.ENUM, 
      values:['admin', 'driver'], 
      allowNull: false, 
      defaultValue: 'driver'
    },
    phone: {
      type: DataTypes.BIGINT, 
      allowNull: false, 
      unique: true,
      validate: {
        isNumeric: true
      } 
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false, 
      validate:{
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true, 
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING, 
      allowNull: false, 
      notEmpty: true
    },
  });

  User.associate = (models) =>{
    User.hasMany(models.Load, {
    })
  }

  User.comparePassword = (password, user, done, next) => {
    var passwd = user.password;
    console.log("Inside compare pass")
    bcrypt.compare(password, passwd, (err, isMatch) => {
      console.log("Inside bcrypt function")
      if (err) {
        console.log(err)
      }
      if (isMatch){
        console.log("this worked and user is" + user);
        return done(null, user)
      }
      else{
        return done(null, false)
      }
    });
  }
  
  return User;
};