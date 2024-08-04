// models/MRAccess.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getNextSequenceValue = require('../utils/getNextSequenceValue');

const MRAccessSchema = new Schema({
  id: { type: Number, unique: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  access: { type: Boolean, default: true }
});

MRAccessSchema.pre('save', async function(next) {
  if (!this.id) {
    this.id = await getNextSequenceValue('mrAccessId');
  }
  next();
});

module.exports = mongoose.model('MRAccess', MRAccessSchema);
