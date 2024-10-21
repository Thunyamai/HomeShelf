const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Joi = require('joi');

// Validation schema สำหรับ Item
const itemSchema = Joi.object({
  itemName: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(),
  status: Joi.string().valid('Sufficient', 'Near out', 'Out of stock').required(),
  householdId: Joi.number().integer().required(),
  roomId: Joi.number().integer().required(),
});

// เพิ่มสินค้าใหม่ใน Inventory
exports.addItem = async (req, res) => {
  console.log("Received a request to add item");
  
  const { error } = itemSchema.validate(req.body);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  // ตรวจสอบ request body
  console.log("Request body:", req.body);

  const { itemName, quantity, status, householdId, roomId } = req.body;

  try {
    // ตรวจสอบการเชื่อมต่อฐานข้อมูลด้วยการดึงข้อมูล (สำหรับ debug)
    const items = await prisma.item.findMany();
    console.log("Current items in database before adding new item:", items);

    // เพิ่มสินค้าใหม่ในฐานข้อมูล
    const item = await prisma.item.create({
      data: {
        itemName,
        quantity,
        status,
        householdId,
        roomId,
      },
    });

    // ตรวจสอบการเพิ่มสินค้าในฐานข้อมูล (สำหรับ debug)
    const updatedItems = await prisma.item.findMany();
    console.log("Items in database after adding new item:", updatedItems);

    res.status(201).json({
      message: 'เพิ่มสินค้านี้เข้าชั้นวาง เรียบร้อยแล้ว',
      item,
    });
  } catch (err) {
    console.error('Error adding item:', err.message); 
    res.status(500).json({ message: 'Error adding item', error: err.message });
  }
};

// แก้ไขข้อมูลสินค้าใน Inventory
exports.updateItem = async (req, res) => {
  const schema = Joi.object({
    itemId: Joi.number().integer().required(),
    itemName: Joi.string(),
    quantity: Joi.number().integer().min(0),
    status: Joi.string().valid('Sufficient', 'Near out', 'Out of stock'),
    roomId: Joi.number().integer(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { itemId, itemName, quantity, status, roomId } = req.body;

  try {
    const item = await prisma.item.update({
      where: { id: itemId },
      data: {
        itemName,
        quantity,
        status,
        roomId,
      },
    });

    res.json({
      message: 'แก้ไขข้อมูลสินค้าในชั้นวาง เรียบร้อยแล้ว',
      item,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating item', error: err.message });
  }
};

// ลบสินค้าออกจาก Inventory
exports.deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    await prisma.item.delete({
      where: { id: parseInt(itemId) },
    });

    res.json({
      message: 'ลบสินค้านี้ออกจากชั้นวางในบ้านแล้ว',
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};

// แสดงสินค้าออกจาก Inventory
exports.getItemByHouseholdId = async (req, res) => {
  const { houseId } = req.params;

  try {
    const result = await prisma.item.findMany({
      where: { householdId: +houseId },
    });

    res.json({
      result
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};
