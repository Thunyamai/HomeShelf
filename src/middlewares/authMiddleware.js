const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // ดึง JWT token จาก header

  console.log("Authorization Header:", authHeader); // ตรวจสอบว่า authorization header ถูกส่งมาหรือไม่

  if (!token) {
    console.log("Token missing!");
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // ตรวจสอบและถอดรหัส JWT token
    if (err) {
      console.log("Token invalid or expired:", err.message);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // เก็บข้อมูล decoded จาก token ใน request object
    console.log("Token verified, decoded:", decoded); // ตรวจสอบว่าข้อมูลจาก token ถูกถอดรหัสได้อย่างถูกต้อง
    req.user = decoded;
    next(); 
  });
};

module.exports = authenticateToken;
