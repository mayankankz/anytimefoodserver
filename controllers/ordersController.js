const { validationResult } = require("express-validator");
const Orders = require("../models/Orders");
const { v4: uuidv4 } = require('uuid');

exports.placeOrder = async(req,res) => {
    const order = req.body
    
    try {
         // Validate input
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
             return res.status(400).json({
                 status: 'error',
                 message: 'Validation failed',
                 errors: errors.array(),
             });
         }

         const OrderId = req.body.orderID || uuidv4();

         const placedOrder = await Orders.create({...order,OrderId:OrderId})
         console.log(placedOrder.dataValues.id);
         const eventEmmiter = req.app.get('eventEmmiter')
        eventEmmiter.emit('newOrder',{...order,items: JSON.stringify(order.items),OrderId:OrderId,id:placedOrder.dataValues.id })
         res.status(201).json({
            status: 'success',
            message: 'Order placed successfully.',
            placedOrder,
        });
 
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}


exports.getAllCustomerOrders = async(req,res) => {
    const {id} =req.params;
    console.log(id);
    try {
        const AllOrders = await Orders.findAll({where: {customerId: id},
            order: [['createdAt', 'ASC']],
          });
        res.status(200).json({
            status: 'success',
            message: 'Orders Fetched successfully.',
            AllOrders,
        })
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}