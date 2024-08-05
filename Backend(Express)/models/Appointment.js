// models/Appointment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentDate: { type: String, required: true },
  From: { type: String, required: true },
  To: { type: String, required: true },
  isTaken: { type: Boolean, default: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' }
});


module.exports = mongoose.model('Appointment', AppointmentSchema);
