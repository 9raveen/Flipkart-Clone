import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import styles from './ProductCard.module.css'

const PLACEHOLDER = 'https://via.placeholder.com/200x200?text=No+Image'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product.id)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product.id)
  }

  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={product.images?.[0] || PLACEHOLDER}
          alt={product.name}
          className={styles.image}
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        <button className={styles.wishlistBtn} onClick={handleWishlist} aria-label="Wishlist">
          {wishlisted ? <FaHeart color="#ff6161" size={18} /> : <FiHeart size={18} />}
        </button>
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>

        {product.rating > 0 && (
          <div className={styles.rating}>
            <span className={styles.ratingBadge}>
              {product.rating} <FaStar size={10} />
            </span>
            <span className={styles.reviewCount}>({product.reviewCount?.toLocaleString()})</span>
          </div>
        )}

        <div className={styles.pricing}>
          <span className={styles.price}>₹{Number(product.price).toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <>
              <span className={styles.originalPrice}>₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
              <span className={styles.discount}>{product.discount}% off</span>
            </>
          )}
        </div>

        {product.brand && <p className={styles.brand}>{product.brand}</p>}
      </div>
    </Link>
  )
}
