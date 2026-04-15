import axios from 'axios'

// In production, VITE_API_URL is set to the deployed backend URL
// In development, Vite proxy handles /api -> localhost:5000
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
}

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
}

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
  updateItem: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart/clear'),
}

export const ordersAPI = {
  place: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
}

export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
}

export default api
