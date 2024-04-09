const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  ReservationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CustomerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CustomerEmail:{
    type: DataTypes.STRING,
    allowNull: false
  },
  ReservationTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  PartySize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Comments:{
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Reservation;
