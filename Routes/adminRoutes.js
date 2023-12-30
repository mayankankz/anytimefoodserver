
const express = require('express');
const { loginValidation } = require('../middleware/validators');
const { loginService } = require('../controllers/userController');
const { getAllUsers, addItem, addCategory, getAllCategory, getAllItems, getAllOrders, updateOrderStatus, updateItem, deleteItem, adminDashboard } = require('../controllers/adminController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}_${file.originalname}`
      cb(null, uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage });



const router = express.Router();

router.get('/dashboard',adminDashboard )
router.post('/login',loginValidation, loginService);
router.get("/getallusers",getAllUsers)
router.post("/additem", upload.array('imgs'), addItem)
router.post("/addcategory", addCategory)
router.get("/getallcategory", getAllCategory)
router.get("/getallitems",getAllItems)
router.get("/getallorders", getAllOrders)
router.post("/updateorderstatus",updateOrderStatus)
router.post("/updateitem/:id",updateItem)
router.post("/deleteitem/:id",deleteItem)

module.exports = router;
