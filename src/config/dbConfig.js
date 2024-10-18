const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully');
  } catch (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1); 
  }
};

module.exports = {
  prisma,
  connectDB,
};