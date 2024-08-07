// models/Patient.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  age: { type: Number, default: 0 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  parentFirstName: { type: String, required: true },
  parentLastName: { type: String, required: true },
  parentPhoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Patient', PatientSchema);
