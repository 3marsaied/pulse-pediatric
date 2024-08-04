// models/Appointment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getNextSequenceValue = require('../utils/getNextSequenceValue');

const AppointmentSchema = new Schema({
  id: { type: Number, unique: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentDate: { type: String, required: true },
  From: { type: String, required: true },
  To: { type: String, required: true },
  isTaken: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' }
});

AppointmentSchema.pre('save', async function(next) {
  if (!this.id) {
    this.id = await getNextSequenceValue('appointmentId');
  }
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
