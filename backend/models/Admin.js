const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Admin'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      default: 'admin@gmail.com'
    },
    password: {
      type: String,
      required: true
      // Remove the default here - we'll handle it in the creation function
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

// Improved default admin creation
const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      // Create admin with pre-hashed password
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await Admin.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Default admin created with hashed password');
      await Admin.updateOne({ email: 'admin@gmail.com' }, { $set: { password: hashedPassword } });
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};


// Add a delay to ensure mongoose connection is established
setTimeout(() => {
  createDefaultAdmin();
}, 2000);

module.exports = Admin;