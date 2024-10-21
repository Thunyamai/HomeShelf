const express = require('express');
const { getHousehold } = require('../controllers/houseController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// เส้นทางสำหรับการดึงข้อมูล Household ของผู้ใช้
router.get('/', authenticateToken, getHousehold);

module.exports = router;
