// models/User.js
const { Sequelize } = require('sequelize');
const sequelize = require('../Utills/Database');

const Category = sequelize.define('Category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }
});

module.exports = Category;
