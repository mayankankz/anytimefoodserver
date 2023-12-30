const { Sequelize } = require('sequelize');
const sequelize =  require('../Utills/Database');


const Orders = sequelize.define('Order', {
    customerId: {
        type : Sequelize.STRING,
        allowNull : false,
        required: true
    },
    Name: {type : Sequelize.STRING,required: true,allowNull : false},
    OrderId: {type: Sequelize.STRING, required: true,allowNull : false,},
    items: { type: Sequelize.JSON,
        allowNull: false, },
    phone: { type: Sequelize.STRING, required: true,allowNull : false, },
    address: { type: Sequelize.STRING, required: true,allowNull : false, },
    paymentType: { type: Sequelize.STRING, defaultValue: 'COD',allowNull : false, },
    status: { type: Sequelize.STRING, defaultValue: 'order_placed',allowNull : false, },
    orderValue: { type: Sequelize.STRING, allowNull: false },
});

module.exports = Orders;