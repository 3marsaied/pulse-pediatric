// models/MRAccess.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MRAccessSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  access: { type: Boolean, default: true }
});



module.exports = mongoose.model('MRAccess', MRAccessSchema);
