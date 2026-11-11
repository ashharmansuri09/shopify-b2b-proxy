async function executeGraphQL(query, variables = {}) {
    const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2026-01/graphql.json`;
  
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
      },
      body: JSON.stringify({ query, variables })
    });
  
    const payload = await response.json();
    if (payload.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(payload.errors)}`);
    }
    return payload.data;
  }
  
  async function getCustomerTags(customerId) {
    const query = `
      query getCustomer($id: ID!) {
        customer(id: $id) {
          id
          email
          tags
        }
      }
    `;
    const formattedId = customerId.startsWith('gid://') ? customerId : `gid://shopify/Customer/${customerId}`;
    const data = await executeGraphQL(query, { id: formattedId });
    return data.customer ? data.customer.tags : [];
  }
  
  async function createWholesaleDraftOrder({ customerId, email, lineItems, note }) {
    const mutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            name
            invoiceUrl
            totalPrice
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
  
    const formattedCustomerId = customerId && !customerId.startsWith('gid://') 
      ? `gid://shopify/Customer/${customerId}` 
      : customerId;
  
    const input = {
      customerId: formattedCustomerId || null,
      email: email || undefined,
      note: `[B2B Quote Request] ${note || ''}`,
      tags: ['B2B-Quote-Pending'],
      lineItems: lineItems.map(item => ({
        variantId: item.variantId.startsWith('gid://') ? item.variantId : `gid://shopify/ProductVariant/${item.variantId}`,
        quantity: parseInt(item.quantity, 10),
        originalUnitPrice: item.targetPrice ? item.targetPrice.toString() : undefined
      }))
    };
  
    const data = await executeGraphQL(mutation, { input });
    const errors = data.draftOrderCreate.userErrors;
    if (errors && errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(', '));
    }
    return data.draftOrderCreate.draftOrder;
  }
  
  module.exports = { getCustomerTags, createWholesaleDraftOrder };