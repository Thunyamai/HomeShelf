const express = require('express');
const { register, loginWithHouseID, forgotHouseID  } = require('../controllers/authController');
const router = express.Router();

// ลงทะเบียนผู้ใช้ใหม่
router.post('/register', register);

// เข้าสู่ระบบด้วย House ID
router.post('/login', loginWithHouseID);

// เส้นทางสำหรับ Forgot House ID
router.post('/forgot-house-id', forgotHouseID);

module.exports = router;
