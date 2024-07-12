const fetch = require('node-fetch');
const sharp = require('sharp');
const Product = require('../models/Product');
const Request = require('../models/Request');
const { triggerWebhook } = require('./webhookService');

const processImage = async (productId, imageUrl) => {
  try {
    // Download image
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // Compress image
    const compressedBuffer = await sharp(buffer)
      .jpeg({ quality: 50 })
      .toBuffer();

    // Upload compressed image (replace with your actual upload logic)
    const outputUrl = await uploadImage(compressedBuffer);

    // Update product
    const product = await Product.findByIdAndUpdate(
      productId,
      { 
        $push: { outputImageUrls: outputUrl },
        $set: { status: 'completed' }
      },
      { new: true }
    );

    // Check if all images for this product are processed
    if (product.inputImageUrls.length === product.outputImageUrls.length) {
      // Trigger webhook
      await triggerWebhook(product);

      // Check if all products for this request are completed
      const request = await Request.findOne({ productIds: productId });
      const allCompleted = await Product.countDocuments({ 
        _id: { $in: request.productIds }, 
        status: 'completed' 
      }) === request.productIds.length;

      if (allCompleted) {
        await Request.findByIdAndUpdate(request._id, { status: 'completed' });
      }
    }

    return product;
  } catch (error) {
    console.error('Image processing error:', error);
    await Product.findByIdAndUpdate(productId, { status: 'failed' });
    throw error;
  }
};

// Replace this with your actual image upload logic
const uploadImage = async (buffer) => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `https://example.com/output-${Date.now()}.jpg`;
};

module.exports = { processImage };