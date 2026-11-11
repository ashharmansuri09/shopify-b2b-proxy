const TIER_DISCOUNTS = {
    'b2b-tier-1': 0.15, // 15% off
    'b2b-tier-2': 0.25, // 25% off
    'b2b-vip': 0.35     // 35% off
  };
  
  function calculateB2BPrice(basePrice, customerTags = [], quantity = 1) {
    let highestDiscount = 0;
  
    for (const tag of customerTags) {
      const normalizedTag = tag.trim().toLowerCase();
      if (TIER_DISCOUNTS[normalizedTag] && TIER_DISCOUNTS[normalizedTag] > highestDiscount) {
        highestDiscount = TIER_DISCOUNTS[normalizedTag];
      }
    }
  
    // Volume Break: Additional 5% discount for 50+ units
    if (quantity >= 50 && highestDiscount > 0) {
      highestDiscount = Math.min(highestDiscount + 0.05, 0.50);
    }
  
    const finalUnitPrice = basePrice * (1 - highestDiscount);
  
    return {
      originalPrice: parseFloat(basePrice.toFixed(2)),
      finalPrice: parseFloat(finalUnitPrice.toFixed(2)),
      discountApplied: `${(highestDiscount * 100).toFixed(0)}%`,
      totalAmount: parseFloat((finalUnitPrice * quantity).toFixed(2))
    };
  }
  
  module.exports = { calculateB2BPrice };