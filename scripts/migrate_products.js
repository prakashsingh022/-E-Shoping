const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const products = await Product.find();
    console.log(`Found ${products.length} products. Updating...`);

    for (const product of products) {
      let updated = false;

      // Migrate sizes if empty
      if (!product.sizes || product.sizes.length === 0) {
        product.sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        updated = true;
      }

      // Migrate colors if empty
      if (!product.colors || product.colors.length === 0) {
        const defaultColors = [
          { name: 'Classic Black', code: '#1a1a1a' },
          { name: 'Elegant White', code: '#ffffff' },
          { name: 'Ruby Red', code: '#e11d48' }
        ];

        // If old color field exists, try to use it
        if (product.color) {
          product.colors = [{ name: product.color, code: '#3b82f6' }, ...defaultColors.slice(0, 2)];
        } else {
          product.colors = defaultColors;
        }
        updated = true;
      }

      if (updated) {
        await product.save();
        console.log(`Updated product: ${product.name}`);
      }
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
