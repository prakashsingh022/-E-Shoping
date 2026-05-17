const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Section = require('./models/Section');

dotenv.config();

const unassign = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const suitSection = await Section.findOne({ slug: 'suit-set-edition' });
    if (!suitSection) {
      console.log('Section not found');
      process.exit();
    }

    const result = await Product.updateMany(
      { section: suitSection._id },
      { $set: { section: null } }
    );

    console.log(`Unassigned ${result.modifiedCount} products from suit-set-edition section`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

unassign();
