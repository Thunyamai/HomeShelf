const express = require('express');
const { register, loginWithHouseID } = require('../controllers/authController');
const router = express.Router();

// ลงทะเบียนผู้ใช้ใหม่
router.post('/register', register);

// เข้าสู่ระบบด้วย House ID
router.post('/login', loginWithHouseID);

module.exports = router;
