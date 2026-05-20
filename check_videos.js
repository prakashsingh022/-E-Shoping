require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Video = require('./models/Video');

async function run() {
  await connectDB();
  const videos = await Video.find({}).populate('productId');
  console.log(JSON.stringify(videos, null, 2));
  process.exit(0);
}
run();
