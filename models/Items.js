// models/User.js
const { Sequelize } = require('sequelize');
const sequelize = require('../Utills/Database');

const Items = sequelize.define('Item', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Imgs: {
    type: Sequelize.JSON,
    required: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  inStock :{
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true    
}
});

module.exports = Items;
