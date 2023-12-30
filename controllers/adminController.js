const Items = require("../models/Items");
const User = require("../models/Users")
const Category = require("../models/Category");
const Orders = require("../models/Orders");
const { Op } = require("sequelize");
const Offers = require("../models/Offers");
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({
            users: users,
            message: 'User fetched successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}


exports.addItem = async (req, res) => {
    const files = req.files.map(file => file.path);
    const data = JSON.parse(req.body.ItemsDetails);

    try {
        const item = await Items.create({
            title: data.title,
            Imgs: files,
            description: data.description,
            category: data.category,
            price: data.price,
            inStock: data.Stock == 'In Stock' ? true : false,
        })
        return res.status(201).json({
            item: item,
            message: 'Item added successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

exports.addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const category = await Category.findOne({ where: { name: name } })
        if (category) {
            return res.status(403).json({
                message: 'Category Alredy Exists.'
            })
        }

        const categorys = await Category.create({ name })

        const allCategory = await Category.findAll()

        return res.status(201).json({
            allCategory: allCategory.map((cat) => cat.name),
            message: 'Category added successfully.'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}


exports.getAllCategory = async (req, res) => {
    try {
        const category = await Category.findAll()
        return res.status(200).json({
            categorys: category.map((cat) => cat.name),
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getAllItems = async (req, res) => {
    try {
        const Itemsarr = await Items.findAll()
        const category = await Category.findAll()
        return res.status(200).json({
            Items: Itemsarr,
            categorys: category.map((cat) => cat.name)
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getAllOrders = async (req, res) => {
    try {
        const Itemsarr = await Orders.findAll({
            where: {
                status: {
                    [Op.ne]: 'order_delivered'
                }
            },
            order: [['createdAt', 'DESC']],
        });


        return res.status(200).json({
            Items: Itemsarr,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateOrderStatus = async (req, res, next) => {
    const { status, id } = req.body;

    try {
        const updatedStatus = await Orders.update({ status: status }, { where: { OrderId: id } })
        const eventEmmiter = req.app.get('eventEmmiter')
        eventEmmiter.emit('orderUpdated', { OrderId: id, status: status })
        return res.status(200).json({
            status: "Success",
            message: 'Status Updated successfully.'
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: 'Something went wrong.',
            error: error.message
        })
    }
}


exports.updateItem = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedItem = await Items.update({ ...req.body, inStock: req.body.inStock == 'In Stock' ? true : false }, { where: { id: id } })
        return res.status(200).json({
            status: "Success",
            message: 'Item updated successfully.'
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: 'Something went wrong.',
            error: error.message
        })
    }
}

exports.deleteItem = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedItem = await Items.destroy({ where: { id: id } })
        return res.status(200).json({
            status: "Success",
            message: 'Item deleted successfully.'
        })
    } catch (error) {
        return res.status(200).json({
            status: "Error",
            message: 'Something went wrong.',
            error: error.message
        })
    }
}

exports.adminDashboard = async (req, res, next) => {
    try {
        const orders = await Orders.findAll();
        const items = await Items.findAll();
        const offers = await Offers.findAll();
        const users = await User.findAll();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

        const todaysorders = await Orders.findAll({
            where: {
                createdAt: {
                    [Op.gte]: today,
                },
            },
        });

        const totalOrders = orders.length;
        const totalItems = items.length;
        const totalOffers = offers.length;
        const totalUsers = users.length;

        const totalsales = orders.reduce((acc, order) => {
            return parseInt(order.orderValue) + acc
        }, 0)

        const todaysSales = todaysorders.reduce((acc, order) => {
            return parseInt(order.orderValue) + acc
        }, 0)

        const monthlyRevenue = [];
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        for (let i = 0; i < 6; i++) {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59, 999);

            const ordersInMonth = await Orders.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                },
            });

            const revenueInMonth = ordersInMonth.reduce((acc, order) => {
                return acc + parseInt(order.orderValue);
            }, 0);

            // Format the month as 'Jan', 'Feb', etc.
            const monthLabel = startOfMonth.toLocaleString('default', { month: 'short' });

            monthlyRevenue.push({ name: monthLabel, Total: revenueInMonth });
        }

        return res.status(200).json({
            status: "Success",
            admindata: { totalOrders, totalUsers, totalOffers, totalItems, totalsales,todaysSales,monthlyRevenue,lastestorders: orders.slice(0,5) },
        })

    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: 'Something went wrong.',
            error: error.message
        })
    }
}