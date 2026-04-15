import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI } from '../api'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await cartAPI.getCart()
      setCartItems(data)
    } catch {
      // silently fail if backend not connected
    }
  }, [])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true)
    try {
      await cartAPI.addItem(productId, quantity)
      await fetchCart()
      toast.success('Added to cart')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id, quantity) => {
    try {
      await cartAPI.updateItem(id, quantity)
      await fetchCart()
    } catch (err) {
      toast.error('Failed to update quantity')
    }
  }

  const removeFromCart = async (id) => {
    try {
      await cartAPI.removeItem(id)
      setCartItems(prev => prev.filter(i => i.id !== id))
      toast.success('Removed from cart')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clearCart()
      setCartItems([])
    } catch {}
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0)
  const cartOriginalTotal = cartItems.reduce((sum, i) => sum + (i.product?.originalPrice || i.product?.price || 0) * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, cartOriginalTotal, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
