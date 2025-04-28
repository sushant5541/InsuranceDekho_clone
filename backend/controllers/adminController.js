const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

// Admin login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await admin.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        req.session.isAdmin = true;
        req.session.adminId = admin._id;

        res.status(200).json({ message: 'Admin logged in successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Admin logout
exports.logoutAdmin = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Admin logged out' });
    });
};

// Get Admin Profile (optional)
exports.getAdminProfile = async (req, res) => {
    try {
        const adminId = req.session.adminId;
        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Edit Category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await Category.findByIdAndDelete(categoryId);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

// -------- Product Management --------

// Create Product (Insurance Plan)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, premium, coverageAmount, category, features, insurer, planType } = req.body;
    const product = await Product.create({
      name, description, premium, coverageAmount, category, features, insurer, planType
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Edit Product
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// -------- User Management --------

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Block/Unblock User
exports.toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};