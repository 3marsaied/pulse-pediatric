// models/Doctor.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getNextSequenceValue = require('../utils/getNextSequenceValue');

const DoctorSchema = new Schema({
  id: { type: Number, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userName: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
  numberOfRating: { type: Number, default: 0 },
  price: { type: Number, required: true },
  profilePicture: { type: String, default: null },
  role: { type: String, default: "doctor" },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
});

DoctorSchema.pre('save', async function(next) {
  if (!this.id) {
    this.id = await getNextSequenceValue('doctorId');
  }
  next();
});

module.exports = mongoose.model('Doctor', DoctorSchema);
