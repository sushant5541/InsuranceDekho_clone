const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId }).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get product detail
exports.getProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details' });
  }
};

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, premium, coverageAmount, category, features, insurer, planType } = req.body;
    const product = await Product.create({
      name,
      description,
      premium,
      coverageAmount,
      category,
      features,
      insurer,
      planType
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};
