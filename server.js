const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/dbConfig');
const authRoutes = require('./src/routes/authRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const shoppingRoutes = require('./src/routes/shoppingRoutes');

dotenv.config();
connectDB()

const app = express();

// Custom morgan format ที่แสดงข้อมูลสำคัญและ timestamp
morgan.token('date', () => new Date().toISOString()); // อันนี้คือเพิ่ม token สำหรับแสดง timestamp นะ

// ใช้ morgan จ้า
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :date')
);

// สร้าง Middleware นะ ทำอะไรต้องผ่านอันนี้
app.use(cors());                  // เปิดการใช้งาน CORS เพื่อรองรับการเชื่อมต่อจากต่างโดเมน
app.use(express.json());           // ใช้ body-parser สำหรับรับ JSON
app.use(morgan('dev'));            // ใช้ morgan แสดง log การทำงานในโหมด dev

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/shopping', shoppingRoutes);


// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the server`);
});