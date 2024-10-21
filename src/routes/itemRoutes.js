const express = require('express');
const { addItem, updateItem, deleteItem, getItemByHouseholdId } = require('../controllers/itemController'); // ตรวจสอบให้แน่ใจว่า updateItem ถูกนำเข้าอย่างถูกต้อง
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// เพิ่มสินค้าใหม่ใน Inventory (ใช้ authenticateToken)
router.post('/', authenticateToken, addItem);

// แก้ไขสินค้าใน Inventory (ใช้ authenticateToken)
router.patch('/', authenticateToken, updateItem); // ตรวจสอบให้ใช้ updateItem ที่ถูกต้อง

// ลบสินค้าใน Inventory (ใช้ authenticateToken)
router.delete('/:itemId', authenticateToken, deleteItem);

// แสดงสินค้าใน Inventory (ใช้ authenticateToken)
router.get('/:houseId', authenticateToken, getItemByHouseholdId);

module.exports = router;
