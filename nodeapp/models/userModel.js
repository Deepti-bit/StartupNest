const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      alias: 'username',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
        message: "Invalid email format",
      },
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      
      validate: {
        validator: (v) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(v),
        message: "Password must be at least 6 characters, with one uppercase, one lowercase, and one number.",
      },
    },
    role: {
      type: String,
      required: true,
      enum: ['Entrepreneur', 'Mentor', 'Admin'], 
      trim: true,
    },
    
    status: {
      type: String,
      enum: ['active', 'pending', 'rejected'],
      default: 'active',
    },
    
    resumePath: {
      data: Buffer,                 
      contentType: String,          
      filename: String,             
      size: Number,                 
      uploadedAt: { type: Date, default: Date.now }
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('User', userSchema);