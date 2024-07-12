const fetch = require('node-fetch');

const triggerWebhook = async (product) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('Webhook URL not set. Skipping webhook.');
      return;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        productName: product.productName,
        inputImageUrls: product.inputImageUrls,
        outputImageUrls: product.outputImageUrls
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    console.log('Webhook triggered successfully');
  } catch (error) {
    console.error('Webhook error:', error);
  }
};

module.exports = { triggerWebhook };