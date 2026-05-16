const Product = require('../models/Product');
const Section = require('../models/Section');
const cloudinary = require('cloudinary').v2;
const logActivity = require('../utils/logger');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, section: sectionSlug } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, salePrice, description, media, category, stock, sizes, colors, fabric, image } = req.body;

    const product = await Product.create({
      name,
      price,
      salePrice,
      description,
      media: media || [], // Expecting array of {url, public_id, type}
      category,
      stock,
      sizes: sizes || [],
      colors: colors || [],
      fabric,
      image: image || (media?.[0]?.url || null),
    });

    await logActivity(
      req.admin._id,
      'CREATE_PRODUCT',
      `Product: ${product.name} | Price: $${product.price} | Stock: ${product.stock}`,
      req.ip
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, salePrice, description, media, category, stock, sizes, colors, fabric, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const oldName = product.name;
      product.name = name || product.name;
      product.price = price || product.price;
      product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;
      product.description = description || product.description;
      product.media = media || product.media;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.fabric = fabric || product.fabric;
      
      // Sync image and media
      if (image) {
        product.image = image;
      } else if (media && media.length > 0) {
        product.image = media[0].url;
      }

      const updatedProduct = await product.save();

      await logActivity(
        req.admin._id,
        'UPDATE_PRODUCT',
        `Product: ${oldName} -> ${updatedProduct.name} | Price: $${updatedProduct.price} | Stock: ${updatedProduct.stock}`,
        req.ip
      );

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const productName = product.name;
      // Delete all associated media from Cloudinary first
      if (product.media && product.media.length > 0) {
        for (const item of product.media) {
          let resource_type = 'image';
          if (item.type === 'video') resource_type = 'video';
          if (item.type === 'pdf') resource_type = 'raw';

          await cloudinary.uploader.destroy(item.public_id, { resource_type });
        }
      }

      await Product.findByIdAndDelete(req.params.id);

      await logActivity(
        req.admin._id,
        'DELETE_PRODUCT',
        `Removed Product: ${productName}`,
        req.ip
      );

      res.json({ message: 'Product and associated media removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
