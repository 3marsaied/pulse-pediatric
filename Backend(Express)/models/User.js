// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getNextSequenceValue = require('../utils/getNextSequenceValue');

const UserSchema = new Schema({
  userId: { type: Number, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
  PhoneNumber: { type: String },
  age: { type: Number },
  profilePicture: { type: String },
  role: { type: String, required: true },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
});

UserSchema.pre('save', async function(next) {
  if (!this.userId) {
    this.userId = await getNextSequenceValue('userId');
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
