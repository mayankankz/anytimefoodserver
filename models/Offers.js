// models/User.js
const { Sequelize } = require('sequelize');
const sequelize = require('../Utills/Database');

const Offers = sequelize.define('Offer', {
  code: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  validTill: {
    type: Sequelize.DATE,
    allowNull: false,
  }
});

module.exports = Offers;
