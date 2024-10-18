const express = require('express');
const { addItemToShoppingList, updateShoppingListItem, deleteShoppingListItem, getShoppingListbyHouseholdId } = require('../controllers/shoppingController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// เพิ่มรายการใน Shopping List (ใช้ authenticateToken)
router.post('/', authenticateToken, addItemToShoppingList);

// แก้ไขรายการใน Shopping List (ใช้ authenticateToken)
router.patch('/', authenticateToken, updateShoppingListItem);

// ลบรายการใน Shopping List (ใช้ authenticateToken)
router.delete('/:itemId', authenticateToken, deleteShoppingListItem);

// แสดงรายการใน Shopping List (ใช้ authenticateToken)
router.get('/:householdId', authenticateToken, getShoppingListbyHouseholdId);

module.exports = router;
