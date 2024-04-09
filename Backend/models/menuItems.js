const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  // category: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // },
  availabilityStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: true
  },
  image: {
    type: DataTypes.STRING, 
    allowNull: true 
  }
});

module.exports = MenuItem;
