// models/Reviews.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReviewsSchema = new Schema({

  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true }
});

module.exports = mongoose.model('Reviews', ReviewsSchema);
