require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Video = require('./models/Video');
const Product = require('./models/Product');

async function run() {
  await connectDB();
  const product = await Product.findOne({});
  if (!product) {
    console.error('No products found in DB to link!');
    process.exit(1);
  }
  
  console.log(`Linking unlinked videos to product: ${product.name} (${product._id})`);
  const result = await Video.updateMany(
    { $or: [{ productId: { $exists: false } }, { productId: null }] },
    { $set: { productId: product._id } }
  );
  
  console.log('Update result:', result);
  process.exit(0);
}
run();
