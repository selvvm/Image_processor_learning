const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  serialNumber: Number,
  productName: String,
  inputImageUrls: [String],
  outputImageUrls: [String],
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);