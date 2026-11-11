const { getCustomerTags } = require('../services/shopifyAdmin');
const { calculateB2BPrice } = require('../services/pricingEngine');

async function getPricing(req, res) {
  try {
    const { logged_in_customer_id } = req.query;
    const { variantId, basePrice, quantity } = req.body;

    if (!basePrice || !variantId) {
      return res.status(400).json({ error: 'Missing required variantId or basePrice.' });
    }

    let customerTags = [];
    if (logged_in_customer_id) {
      customerTags = await getCustomerTags(logged_in_customer_id);
    }

    const calculation = calculateB2BPrice(
      parseFloat(basePrice),
      customerTags,
      parseInt(quantity || 1, 10)
    );

    return res.status(200).json({
      success: true,
      variantId,
      customerTags,
      pricing: calculation
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getPricing };