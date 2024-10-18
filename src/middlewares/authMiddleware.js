const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // ดึง JWT token จาก header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // ตรวจสอบและถอดรหัส JWT token
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // เก็บ House ID จาก token ใน request object เพื่อใช้ในฟังก์ชันอื่น ๆ
    // req.houseID = decoded.houseID;
    req.user = user;
    next(); 
  });
};

module.exports = authenticateToken;
