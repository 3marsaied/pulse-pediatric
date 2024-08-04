// models/Reviews.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getNextSequenceValue = require('../utils/getNextSequenceValue');

const ReviewsSchema = new Schema({
  id: { type: Number, unique: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true }
});

ReviewsSchema.pre('save', async function(next) {
  if (!this.id) {
    this.id = await getNextSequenceValue('reviewId');
  }
  next();
});

module.exports = mongoose.model('Reviews', ReviewsSchema);
