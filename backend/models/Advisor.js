const mongoose = require('mongoose');

const advisorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization'],
      trim: true
    },
    City: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Please add years of experience'],
      min: [0, 'Experience cannot be negative']
    },
    profilePhoto: {
      type: String,
      default: 'https://randomuser.me/api/portraits/lego/1.jpg',
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for frequently queried fields
advisorSchema.index({ City: 1, specialization: 1, isActive: 1 });

const Advisor = mongoose.model('Advisor', advisorSchema);

module.exports = Advisor;