// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Order = sequelize.define('Order', {
  OrderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  TableNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  OrderTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Order.belongsTo(User, { foreignKey: 'UserID', onDelete: 'CASCADE' });

module.exports = Order;

