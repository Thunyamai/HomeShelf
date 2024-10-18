const express = require('express');
const { addRoom, updateRoom, deleteRoom, getRoomByhouseholdId } = require('../controllers/roomController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// เพิ่มหมวดหมู่ห้องใหม่ (ใช้ authenticateToken)
router.post('/add', authenticateToken, addRoom);

// แก้ไขหมวดหมู่ห้อง (ใช้ authenticateToken)
router.patch('/update', authenticateToken, updateRoom);

// ลบหมวดหมู่ห้อง (ใช้ authenticateToken)
router.delete('/delete/:roomId', authenticateToken, deleteRoom);

// แสดงหมวดหมู่ห้อง (ใช้ authenticateToken)
router.get('/:householdId', authenticateToken, getRoomByhouseholdId);

module.exports = router;
