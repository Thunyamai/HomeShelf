const express = require('express');
const { addItem, updateItem, deleteItem, getItemByHouseholdId } = require('../controllers/itemController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// เพิ่มสินค้าใหม่ใน Inventory (ใช้ authenticateToken)
router.post('/', authenticateToken, addItem);

// แก้ไขสินค้าใน Inventory (ใช้ authenticateToken)
router.patch('/', authenticateToken, updateItem);

// ลบสินค้าใน Inventory (ใช้ authenticateToken)
router.delete('/:itemId', authenticateToken, deleteItem);

// แสดงสินค้าใน Inventory (ใช้ authenticateToken)
router.get('/:houseId', authenticateToken, getItemByHouseholdId);

module.exports = router;
