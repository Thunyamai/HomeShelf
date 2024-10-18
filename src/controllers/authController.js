const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Validation schema สำหรับการลงทะเบียน
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    householdName: Joi.string().required(),
    rooms: Joi.array()
      .items(
        Joi.object({
          roomName: Joi.string().required(),
        })
      )
      .required(),
    items: Joi.array()
      .items(
        Joi.object({
          itemName: Joi.string().required(),
          quantity: Joi.number().integer().min(0).required(),
          status: Joi.string().required(),
          roomName: Joi.string().required(),
        })
      )
      .required(),
  });

// ลงทะเบียนผู้ใช้ใหม่, สร้างบ้าน, ห้อง, และสินค้าแรก
exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  console.log('req.body', req.body)

  const { email, password, householdName, rooms, items } = req.body;

  try {
    // Hash password แบบ asynchronous
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง House ID ใหม่
    const houseID =
      "HS" + Math.random().toString(36).substr(2, 8).toUpperCase();

    // สร้าง Household ใหม่
    const household = await prisma.household.create({
      data: {
        householdName,
        houseID,
      },
    });

    console.log("Household created: ", household);

    // ตรวจสอบว่ามี household หรือไม่ก่อนสร้างผู้ใช้
    if (!household || !household.id) {
      throw new Error("Household creation failed");
    }

    // สร้างผู้ใช้ใหม่ที่เชื่อมโยงกับ Household
    const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          houseID: household.houseID,  // ใช้ houseID ที่สร้างจาก Household
          householdId: household.id,   // เชื่อมโยงกับ householdId ที่สร้างขึ้นก่อนหน้านี้
        },
      });

    console.log("User created: ", user);

    // ตรวจสอบว่าผู้ใช้ถูกสร้างขึ้นหรือไม่
    if (!user || !user.id) {
      throw new Error("User creation failed");
    }

    // สร้าง Room ใหม่ตามที่กำหนด
    const createdRooms = await Promise.all(
      rooms.map((room) =>
        prisma.room.create({
          data: {
            roomName: room.roomName,
            householdId: household.id,
          },
        })
      )
    );

    console.log("Rooms created: ", createdRooms);

    // สร้างสินค้าครั้งแรกที่อยู่ใน Room ต่าง ๆ
    const createdItems = await Promise.all(
      items.map((item) => {
        const room = createdRooms.find((r) => r.roomName === item.roomName);
        if (!room) {
          throw new Error(
            `Room ${item.roomName} not found for item ${item.itemName}`
          );
        }
        return prisma.item.create({
          data: {
            itemName: item.itemName,
            quantity: item.quantity,
            status: item.status,
            roomId: room.id,
            householdId: household.id,
          },
        });
      })
    );

    console.log("Items created: ", createdItems);

    res.status(201).json({
      message:
        "User, household, rooms, and initial items created successfully.",
      houseID: household.houseID,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error registering user and creating household.",
      error: err.message,
    });
  }
};

// ฟังก์ชันสำหรับเข้าสู่ระบบด้วย House ID
exports.loginWithHouseID = async (req, res) => {
  const { houseID } = req.body;

  if (!houseID) {
    return res.status(400).json({ message: "House ID is required." });
  }

  try {
    // ค้นหา Household ด้วย House ID
    const household = await prisma.household.findUnique({
      where: { houseID },
    });

    if (!household) {
      return res.status(400).json({ message: "Invalid House ID." });
    }

    const accessToken = jwt.sign({ id: household.id}, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Login successful",
      houseID: household.houseID,
      householdName: household.householdName,
      accessToken
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in.", error: err.message });
  }
};
