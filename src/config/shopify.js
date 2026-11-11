const crypto = require('crypto');

function verifyShopifyProxyHmac(req, res, next) {
  try {
    const { hmac, signature, ...params } = req.query;
    const incomingHmac = hmac || signature;

    if (!incomingHmac) {
      return res.status(401).json({ error: 'Unauthorized: Missing HMAC signature.' });
    }

    // Sort parameters lexicographically and build signature string
    const sortedKeys = Object.keys(params).sort();
    const message = sortedKeys
      .map(key => {
        const val = Array.isArray(params[key]) ? params[key].join(',') : params[key];
        return `${key}=${val}`;
      })
      .join('');

    const calculatedHmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
      .update(message)
      .digest('hex');

    const calculatedBuffer = Buffer.from(calculatedHmac, 'utf-8');
    const incomingBuffer = Buffer.from(incomingHmac, 'utf-8');

    if (
      calculatedBuffer.length !== incomingBuffer.length ||
      !crypto.timingSafeEqual(calculatedBuffer, incomingBuffer)
    ) {
      return res.status(403).json({ error: 'Forbidden: HMAC validation failed.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal security verification error.' });
  }
}

module.exports = verifyShopifyProxyHmac;