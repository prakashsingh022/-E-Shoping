const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0,
    },
    image: {
      type: String,
    },
    media: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        type: { type: String, enum: ['image', 'video', 'pdf'], required: true },
      }
    ],
    category: {
      type: String,
      required: [true, 'Please add a product category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add product stock count'],
      default: 0,
    },
    salePrice: {
      type: Number,
    },
    sizes: [{
      type: String,
    }],
    colors: [{
      name: { type: String, required: true },
      code: { type: String, required: true },
    }],
    fabric: {
      type: String,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
