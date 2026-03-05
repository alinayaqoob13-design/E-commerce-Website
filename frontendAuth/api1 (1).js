const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
    refresh: `${API_BASE_URL}/auth/refresh-token`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    changePassword: `${API_BASE_URL}/auth/change-password`,
    updateProfile: `${API_BASE_URL}/auth/profile`
  },
  categories: {
    list: `${API_BASE_URL}/categories`,
    get: (slug) => `${API_BASE_URL}/categories/${slug}`
  },
  products: {
    list: `${API_BASE_URL}/products`,
    featured: `${API_BASE_URL}/products/featured`,
    get: (slug) => `${API_BASE_URL}/products/${slug}`,
    related: (id) => `${API_BASE_URL}/products/related/${id}`
  },
  cart: {
    get: `${API_BASE_URL}/cart`,
    add: `${API_BASE_URL}/cart/add`,
    update: (itemId) => `${API_BASE_URL}/cart/item/${itemId}`,
    remove: (itemId) => `${API_BASE_URL}/cart/item/${itemId}`,
    clear: `${API_BASE_URL}/cart/clear`,
    applyCoupon: `${API_BASE_URL}/cart/coupon`
  },
  orders: {
    list: `${API_BASE_URL}/orders`,
    create: `${API_BASE_URL}/orders`,
    get: (id) => `${API_BASE_URL}/orders/${id}`,
    cancel: (id) => `${API_BASE_URL}/orders/${id}/cancel`,
    track: (id) => `${API_BASE_URL}/orders/${id}/track`
  },
  payments: {
    createIntent: `${API_BASE_URL}/payments/create-intent`,
    status: (orderId) => `${API_BASE_URL}/payments/status/${orderId}`
  },
  addresses: {
    list: `${API_BASE_URL}/addresses`,
    create: `${API_BASE_URL}/addresses`,
    update: (id) => `${API_BASE_URL}/addresses/${id}`,
    delete: (id) => `${API_BASE_URL}/addresses/${id}`,
    setDefault: (id) => `${API_BASE_URL}/addresses/${id}/default`
  },
  reviews: {
    list: (productId) => `${API_BASE_URL}/reviews/product/${productId}`,
    create: `${API_BASE_URL}/reviews`,
    update: (id) => `${API_BASE_URL}/reviews/${id}`,
    delete: (id) => `${API_BASE_URL}/reviews/${id}`
  },
  wishlist: {
    list: `${API_BASE_URL}/wishlist`,
    add: `${API_BASE_URL}/wishlist`,
    remove: (productId) => `${API_BASE_URL}/wishlist/${productId}`,
    check: (productId) => `${API_BASE_URL}/wishlist/check/${productId}`
  }
};

export default API_BASE_URL;
