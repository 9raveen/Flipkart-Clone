import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { wishlistAPI } from '../api'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([])

  const fetchWishlist = useCallback(async () => {
    try {
      const { data } = await wishlistAPI.getAll()
      setWishlistItems(data)
    } catch {}
  }, [])

  useEffect(() => { fetchWishlist() }, [fetchWishlist])

  const isWishlisted = (productId) => wishlistItems.some(i => i.productId === productId)

  const toggleWishlist = async (productId) => {
    if (isWishlisted(productId)) {
      try {
        await wishlistAPI.remove(productId)
        setWishlistItems(prev => prev.filter(i => i.productId !== productId))
        toast.success('Removed from wishlist')
      } catch { toast.error('Failed') }
    } else {
      try {
        const { data } = await wishlistAPI.add(productId)
        setWishlistItems(prev => [...prev, data])
        toast.success('Added to wishlist')
      } catch { toast.error('Failed') }
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlistItems, isWishlisted, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
