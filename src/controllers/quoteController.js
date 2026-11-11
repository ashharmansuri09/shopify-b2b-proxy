const { createWholesaleDraftOrder } = require('../services/shopifyAdmin');

async function submitQuote(req, res) {
  try {
    const { logged_in_customer_id } = req.query;
    const { email, lineItems, note } = req.body;

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ error: 'Line items array is required.' });
    }

    const draftOrder = await createWholesaleDraftOrder({
      customerId: logged_in_customer_id,
      email,
      lineItems,
      note
    });

    return res.status(200).json({
      success: true,
      message: 'Quote request registered successfully.',
      quoteId: draftOrder.name,
      draftOrderId: draftOrder.id
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { submitQuote };