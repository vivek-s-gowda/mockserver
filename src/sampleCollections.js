// day-11-mockserver/src/sampleCollections.js
// Pre-configured mock API blueprints

export const SAMPLE_COLLECTIONS = {
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce Storefront API',
    description: 'Products catalog, dynamic user cart, and simulated checkout flow',
    routes: [
      {
        id: 'rt-1',
        name: 'List Catalog Products',
        method: 'GET',
        path: '/api/v1/products',
        status: 200,
        latencyMs: 120,
        responseBody: JSON.stringify({
          data: [
            { id: 'prod_01', title: 'Holographic Neon Keyboard', price: 149.99, inStock: true, rating: 4.8 },
            { id: 'prod_02', title: 'Vaporwave Synth Headset', price: 89.50, inStock: true, rating: 4.6 },
            { id: 'prod_03', title: 'Retro Quartz Terminal Deskmat', price: 34.00, inStock: false, rating: 4.9 }
          ],
          meta: { page: 1, limit: 10, total: 3 }
        }, null, 2)
      },
      {
        id: 'rt-2',
        name: 'Get Product Detail',
        method: 'GET',
        path: '/api/v1/products/:id',
        status: 200,
        latencyMs: 80,
        responseBody: JSON.stringify({
          id: '{{param.id}}',
          title: 'Holographic Neon Peripheral #{{faker.number}}',
          sku: 'SKU-{{param.id}}',
          price: 129.99,
          vendor: '{{faker.company}}',
          generatedAt: '{{faker.date}}'
        }, null, 2)
      },
      {
        id: 'rt-3',
        name: 'Process Checkout Order',
        method: 'POST',
        path: '/api/v1/checkout',
        status: 201,
        latencyMs: 450,
        responseBody: JSON.stringify({
          orderId: 'ord_{{faker.uuid}}',
          status: 'paid',
          currency: 'USD',
          totalAmount: 239.49,
          customer: {
            name: '{{faker.name}}',
            email: '{{faker.email}}'
          },
          confirmedAt: '{{faker.date}}'
        }, null, 2)
      }
    ]
  },
  authService: {
    id: 'authService',
    name: 'Authentication & IAM API',
    description: 'OAuth token endpoints, profile inspector, and session validation',
    routes: [
      {
        id: 'rt-4',
        name: 'User Sign In',
        method: 'POST',
        path: '/api/v1/auth/login',
        status: 200,
        latencyMs: 250,
        responseBody: JSON.stringify({
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockAccessTokenSample',
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: {
            id: 'usr_{{faker.uuid}}',
            name: '{{faker.name}}',
            email: '{{faker.email}}',
            role: 'engineer'
          }
        }, null, 2)
      },
      {
        id: 'rt-5',
        name: 'Fetch Current User Profile',
        method: 'GET',
        path: '/api/v1/users/me',
        status: 200,
        latencyMs: 70,
        responseBody: JSON.stringify({
          id: 'usr_me_{{faker.number}}',
          fullName: '{{faker.name}}',
          email: '{{faker.email}}',
          company: '{{faker.company}}',
          location: '{{faker.city}}',
          verified: true
        }, null, 2)
      },
      {
        id: 'rt-6',
        name: 'Revoke User Session',
        method: 'DELETE',
        path: '/api/v1/auth/session',
        status: 204,
        latencyMs: 100,
        responseBody: ''
      }
    ]
  }
};
