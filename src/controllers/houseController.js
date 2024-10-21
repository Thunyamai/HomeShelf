const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Joi = require('joi');

// Validation schema สำหรับ Household
const householdSchema = Joi.object({
  householdName: Joi.string().required(),
});

// เพิ่ม Household ใหม่
exports.createHousehold = async (req, res) => {
  const { error } = householdSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { householdName } = req.body;

  try {
    const houseID = "HS" + Math.random().toString(36).substr(2, 8).toUpperCase();

    const household = await prisma.household.create({
      data: {
        householdName,
        houseID,
      },
    });

    // สร้าง Room ใหม่ (สามารถเพิ่ม logic สำหรับสร้าง room ได้)
    const room = await prisma.room.create({
      data: {
        roomName: "Default Room", // ตั้งชื่อห้องเริ่มต้น
        householdId: household.id,
      },
    });

    res.status(201).json({
      message: "Household created successfully",
      houseId: household.id,
      roomId: room.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating household", error: err.message });
  }
};

// ดึงข้อมูล Household พร้อมกับ roomId
exports.getHousehold = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }, // ใช้ token ที่ถอดรหัสเพื่อดึงข้อมูล user
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const household = await prisma.household.findUnique({
        where: { id: user.householdId },
      });
  
      if (!household) {
        return res.status(404).json({ message: "Household not found." });
      }
  
      // ค้นหาห้องแรกของ Household นี้
      const room = await prisma.room.findFirst({
        where: { householdId: household.id },
      });
  
      res.status(200).json({
        houseId: household.id,
        householdName: household.householdName,
        roomId: room ? room.id : null,  // ส่ง roomId กลับถ้ามีห้อง
      });
    } catch (err) {
      res.status(500).json({ message: "Error retrieving household.", error: err.message });
    }
  };
  