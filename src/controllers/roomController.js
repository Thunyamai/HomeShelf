const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Joi = require('joi');

// Validation schema สำหรับ Room
const roomSchema = Joi.object({
  roomName: Joi.string().required(),
  householdId: Joi.number().integer().required(),
});

// เพิ่มหมวดหมู่ห้องใหม่
exports.addRoom = async (req, res) => {
  const { error } = roomSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { roomName, householdId } = req.body;

  try {
    // ตรวจสอบว่าหมวดหมู่ห้องที่ต้องการเพิ่มมีอยู่แล้วหรือไม่
    const existingRoom = await prisma.room.findFirst({
      where: {
        roomName,
        householdId,
      },
    });

    if (existingRoom) {
      return res.status(400).json({ message: 'ห้องนี้มีอยู่แล้ว' });
    }

    const room = await prisma.room.create({
      data: {
        roomName,
        householdId,
      },
    });

    res.status(201).json({
      message: 'สร้างห้องเรียบร้อยแล้ว',
      room,
    });
  } catch (err) {
    console.error('Error creating room:', err.message);
    res.status(500).json({ message: 'Error creating room', error: err.message });
  }
};

// แก้ไขหมวดหมู่ห้อง
exports.updateRoom = async (req, res) => {
  const schema = Joi.object({
    roomId: Joi.number().integer().required(),
    roomName: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { roomId, roomName } = req.body;

  try {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { roomName },
    });

    res.json({
      message: 'แก้ไขห้องเรียบร้อยแล้ว',
      room,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating room', error: err.message });
  }
};

// ลบหมวดหมู่ห้อง
exports.deleteRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    await prisma.room.delete({
      where: { id: parseInt(roomId) },
    });

    res.json({
      message: 'ลบห้องนี้แล้ว',
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting room', error: err.message });
  }
};

// แสดงห้องทั้งหมดตาม Household ID
exports.getRoomByhouseholdId = async (req, res) => {
  const { householdId } = req.params;

  try {
    const result = await prisma.room.findMany({
      where: { householdId: +householdId },
    });

    res.json({
      result
    });
  } catch (err) {
    res.status(500).json({ message: 'Error getting all rooms', error: err.message });
  }
};
