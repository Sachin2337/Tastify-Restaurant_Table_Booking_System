// models/Feedback.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');


const Feedback = sequelize.define('Feedback', {
  FeedbackID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Comments: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

Feedback.belongsTo(User, { foreignKey: 'UserID' });

module.exports = Feedback;
