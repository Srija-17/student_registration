// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  srn: { type: String, required: true, trim: true, uppercase: true, unique: true },
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  passwordHash: { type: String, required: true },
  department: { type: String, trim: true },
  year: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

// add indexes for uniqueness (ensure in DB too)
userSchema.index({ srn: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', userSchema);