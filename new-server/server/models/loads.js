'use strict';
module.exports = (sequelize, DataTypes) => {
  const Load = sequelize.define('Load', {

  });

  Load.associate = (models) => {
    Load.belongsTo(models.User, {
      as: 'driver',
      foreignKey: 'UserId',
      unique: true
    })
  }
  return Load;
};