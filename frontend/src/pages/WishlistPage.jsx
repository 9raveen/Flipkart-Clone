import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard/ProductCard'
import styles from './WishlistPage.module.css'

export default function WishlistPage() {
  const { wishlistItems } = useWishlist()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Wishlist ({wishlistItems.length})</h1>

        {wishlistItems.length === 0 ? (
          <div className={styles.empty}>
            <FiHeart size={80} color="#e0e0e0" />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist.</p>
            <Link to="/products" className={styles.shopBtn}>Explore Products</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlistItems.map(item => item.product && (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
