const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const clearSpecs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const result = await Product.updateMany(
      {}, 
      { $set: { sizes: [], colors: [] } }
    );
    
    console.log(`Successfully cleared specifications for ${result.modifiedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to clear specifications:', error);
    process.exit(1);
  }
};

clearSpecs();
