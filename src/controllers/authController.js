const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// ฟังก์ชันสำหรับการลงทะเบียน
exports.register = async (req, res) => {
  const { email, password, householdName } = req.body;

  if (!email || !password || !householdName) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง Household ใหม่
    const household = await prisma.household.create({
      data: {
        householdName,
        houseID: "HS" + Math.random().toString(36).toUpperCase(),
      },
    });

    // สร้าง User ใหม่และเชื่อมกับ Household
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        householdId: household.id,
        houseID: household.houseID,
      },
    });

    // สร้าง JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: "User, household, rooms, and initial items created successfully.",
      houseID: household.houseID, 
      householdId: household.id,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user.", error: err.message });
  }
};

//-------------------------------------------------//
// ฟังก์ชันสำหรับการเข้าสู่ระบบด้วย House ID
exports.loginWithHouseID = async (req, res) => {
  const { houseID } = req.body;

  if (!houseID) {
    return res.status(400).json({ message: "House ID is required." });
  }

  try {
    // ค้นหาข้อมูล Household ด้วย House ID
    const household = await prisma.household.findUnique({
      where: { houseID },
    });

    if (!household) {
      return res.status(404).json({ message: "Household not found." });
    }

    // ค้นหาผู้ใช้ที่เชื่อมโยงกับ Household
    const user = await prisma.user.findFirst({
      where: { householdId: household.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // สร้าง JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Login successful.",
      token,
      houseID: household.houseID,
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in.", error: err.message });
  }
};

// ฟังก์ชันสำหรับการกู้คืน House ID ผ่านทางอีเมล
exports.forgotHouseID = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // ค้นหาผู้ใช้ในฐานข้อมูลโดยใช้อีเมล
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ค้นหาข้อมูล Household ที่เกี่ยวข้องกับผู้ใช้
    const household = await prisma.household.findUnique({
      where: { id: user.householdId },
    });

    if (!household) {
      return res.status(404).json({ message: "Household not found." });
    }

    // ส่ง House ID กลับไปยัง frontend
    res.status(200).json({ houseId: household.houseID });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving House ID.", error: err.message });
  }
};
