const express = require('express');
const Request = require('../models/Request');
const Product = require('../models/Product');

const router = express.Router();

router.get('/:requestId', async (req, res) => {
  try {
    const request = await Request.findOne({ requestId: req.params.requestId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const totalProducts = request.productIds.length;
    const completedProducts = await Product.countDocuments({ 
      _id: { $in: request.productIds }, 
      status: 'completed' 
    });

    const progress = totalProducts > 0 ? Math.round((completedProducts / totalProducts) * 100) : 0;

    res.json({
      requestId: request.requestId,
      status: request.status,
      progress,
      message: `${progress}% of images processed`
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;