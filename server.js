const express = require("express");
const cors = require("cors"); // ประกาศ cors ครั้งเดียวที่นี่
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectDB } = require("./src/config/dbConfig");
const authRoutes = require("./src/routes/authRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const shoppingRoutes = require("./src/routes/shoppingRoutes");
const houseRoutes = require('./src/routes/houseRoutes'); 

dotenv.config();
connectDB();

const app = express();

// Custom morgan format ที่แสดงข้อมูลสำคัญและ timestamp
morgan.token("date", () => new Date().toISOString()); // อันนี้คือเพิ่ม token สำหรับแสดง timestamp นะ

// ใช้ morgan จ้า
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);

// เปิดการใช้งาน CORS เพื่อรองรับการเชื่อมต่อจากต่างโดเมน
app.use(
  cors({
    origin: "http://localhost:5173", // URL ของ frontend
    credentials: true,
  })
);

app.use(express.json()); // ใช้ body-parser สำหรับรับ JSON
app.use(morgan("dev")); // ใช้ morgan แสดง log การทำงานในโหมด dev

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/shopping", shoppingRoutes);
app.use("/api/house", houseRoutes);


// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the server`);
});
