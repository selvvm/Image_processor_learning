const csv = require('csv-parser');
const fs = require('fs');
const Product = require('../models/Product');
const Request = require('../models/Request');
const { imageProcessingQueue } = require('../utils/queue');

const processCsv = async (filePath, requestId) => {
  const products = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        products.push({
          serialNumber: row['S. No.'],
          productName: row['Product Name'],
          inputImageUrls: row['Input Image Urls'].split(',').map(url => url.trim()),
          status: 'pending'
        });
      })
      .on('end', async () => {
        try {
          const savedProducts = await Product.insertMany(products);
          const request = await Request.findOneAndUpdate(
            { requestId },
            { $set: { productIds: savedProducts.map(p => p._id) } },
            { new: true }
          );

          savedProducts.forEach(product => {
            product.inputImageUrls.forEach(url => {
              imageProcessingQueue.add({ productId: product._id, imageUrl: url });
            });
          });

          resolve(savedProducts);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = { processCsv };