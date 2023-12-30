// database/connection.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('anytimefood', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Set to true to log SQL queries
});

module.exports = sequelize;
