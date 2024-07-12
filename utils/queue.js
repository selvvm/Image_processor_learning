const Queue = require('bull');
const { processCsv } = require('../services/csvProcessor');
const { processImage } = require('../services/imageProcessor');

const csvProcessingQueue = new Queue('csvProcessing');
const imageProcessingQueue = new Queue('imageProcessing');

csvProcessingQueue.process(async (job) => {
  const { filePath, requestId } = job.data;
  await processCsv(filePath, requestId);
});

imageProcessingQueue.process(async (job) => {
  const { productId, imageUrl } = job.data;
  await processImage(productId, imageUrl);
});

module.exports = { csvProcessingQueue, imageProcessingQueue };