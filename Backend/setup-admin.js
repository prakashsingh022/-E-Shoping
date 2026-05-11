const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const setupSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ role: 'super_admin' });
    
    if (adminExists) {
      console.log('Super Admin already exists.');
      process.exit(0);
    }

    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@taratara.com',
      password: 'password', // will be hashed automatically by pre-save hook
      role: 'super_admin',
      permissions: [] // Super admin has implicit all access
    });

    console.log('Super Admin created successfully!');
    console.log('Email: admin@taratara.com');
    console.log('Password: password');
    process.exit(0);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

setupSuperAdmin();
