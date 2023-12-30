
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const path = require('path');
const userRoutes = require('./Routes/userRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const paymentsRoutes = require('./Routes/paymentsRoutes');
const userModel = require('./models/Users');
const orders = require('./models/Orders');
const Items = require('./models/Items');
const Category = require('./models/Category');
const Offers = require('./models/Offers');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./Utills/Database');
const Emmiter = require('events');
const { log } = require('console');

const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



io.on('connection', (socket) => {
  console.log('A user connected');
  
  //join a private room

  socket.on('join',(orderId)=>{
    console.log(orderId);
    socket.join(orderId);
  })

  // Handle admin connection
  socket.on('adminConnect', () => {
    console.log('Admin connected:', socket.id);
    socket.join('adminRoom');
  });

  
  


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


const eventEmmiter = new Emmiter();

eventEmmiter.on('orderUpdated',(data)=>{
  io.to(`order_${data.OrderId}`).emit('orderUpdated',data)
})

eventEmmiter.on('newOrder', (data) => {
  console.log('in newOrder',data);
  io.to('adminRoom').emit('newOrderArrived', data); // Notify all clients in the 'adminRoom'
});


app.set('eventEmmiter',eventEmmiter)

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/payments', paymentsRoutes);
app.use(userModel);
app.use(orders);
app.use(Items);
app.use(Category);
app.use(Offers);



sequelize
  .sync()
  .then((result) => {
    console.log('Tables created');
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
