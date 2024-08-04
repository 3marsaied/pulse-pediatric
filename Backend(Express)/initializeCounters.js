// initializeCounters.js
const Counter = require('./models/Counter');

const initializeCounters = async () => {
  const counters = ['userId', 'medicalRecordId', 'patientId', 'appointmentId', 'doctorId', 'reviewId', 'mrAccessId'];
  for (const counter of counters) {
    await Counter.findByIdAndUpdate(counter, { sequenceValue: 0 }, { upsert: true });
  }
};

module.exports = initializeCounters;
