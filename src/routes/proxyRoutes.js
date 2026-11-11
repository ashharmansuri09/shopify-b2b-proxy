const express = require('express');
const router = express.Router();
const verifyProxyHmac = require('../middleware/verifyProxyHmac');
const { getPricing } = require('../controllers/pricingController');
const { submitQuote } = require('../controllers/quoteController');

// All proxy routes pass through HMAC validation
router.use(verifyProxyHmac);

router.post('/pricing', getPricing);
router.post('/quote-request', submitQuote);

module.exports = router;