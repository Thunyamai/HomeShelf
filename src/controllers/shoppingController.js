// controllers/shoppingController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Joi = require('joi');

// Validation schema สำหรับ Shopping List
const shoppingListSchema = Joi.object({
  itemName: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  householdId: Joi.number().integer().required(),
  roomId: Joi.number().integer().required(),
});

// เพิ่มสินค้าใหม่ใน Shopping List
exports.addItemToShoppingList = async (req, res) => {
  console.log('req.body', req.body)
  const { error } = shoppingListSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { itemName, quantity, householdId, roomId } = req.body;

  try {
    const shoppingItem = await prisma.shoppingList.create({
      data: {
        itemName,
        quantity,
        householdId,
        roomId
      },
    });

    res.status(201).json({
      message: 'เพิ่มสินค้าเข้าในรายการของที่ต้องการซื้อแล้ว',
      shoppingItem,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error adding item to shopping list', error: err.message });
  }
};

// แก้ไขรายการใน Shopping List
exports.updateShoppingListItem = async (req, res) => {
  const schema = Joi.object({
    itemId: Joi.number().integer().required(),
    itemName: Joi.string(),
    quantity: Joi.number().integer().min(1),
    status: Joi.string().valid('Pending', 'Purchased'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { itemId, itemName, quantity, status } = req.body;

  try {
    const shoppingItem = await prisma.shoppingList.update({
      where: { id: itemId },
      data: {
        itemName,
        quantity,
        status,
      },
    });

    res.json({
      message: 'แก้ไขรายการสินค้าเรียบร้อยแล้ว',
      shoppingItem,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating shopping list item', error: err.message });
  }
};

// ลบรายการออกจาก Shopping List
exports.deleteShoppingListItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    await prisma.shoppingList.delete({
      where: { id: parseInt(itemId) },
    });

    res.json({
      message: 'ลบสินค้าออกจากรายการของที่ต้องการซื้อแล้ว',
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting shopping list item', error: err.message });
  }
};

// แสดงรายการ Shopping List ทั้งหมดในบ้าน
exports.getShoppingListbyHouseholdId = async (req, res) => {
  const { householdId } = req.params;

  try {
    const result = await prisma.shoppingList.findMany({
      where: { householdId: +householdId },
    });

    res.json({
      result
    });
  } catch (err) {
    res.status(500).json({ message: 'Error getting shopping list item', error: err.message });
  }
};
