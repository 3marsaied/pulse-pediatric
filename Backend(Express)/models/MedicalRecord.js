// models/MedicalRecord.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getNextSequenceValue = require('../utils/getNextSequenceValue');

const MedicalRecordSchema = new Schema({
  id: { type: Number, unique: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  notes: { type: String, default: 'None' },
  treatment: { type: String, default: 'None' },
  createdAt: { type: Date, default: Date.now },
  healthCondition: { type: String, default: 'None' },
  vaccin: { type: String, default: 'None' },
  allergies: { type: String, default: 'None' },
  pastConditions: { type: String, default: 'None' },
  chronicConditions: { type: String, default: 'None' },
  surgicalHistory: { type: String, default: 'None' },
  medications: { type: String, default: 'None' },
  radiologyReport: { type: String, default: 'None' }
});

MedicalRecordSchema.pre('save', async function(next) {
  if (!this.id) {
    this.id = await getNextSequenceValue('medicalRecordId');
  }
  next();
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
