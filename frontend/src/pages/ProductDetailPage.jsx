import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart } from 'react-icons/fa'
import { FiHeart, FiShoppingCart, FiZap, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import { productsAPI } from '../api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import styles from './ProductDetailPage.module.css'

const PLACEHOLDER = 'https://via.placeholder.com/400x400?text=No+Image'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  useEffect(() => {
    productsAPI.getById(id)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingSpinner} />
    </div>
  )

  if (!product) return null

  const wishlisted = isWishlisted(product.id)
  const images = product.images?.length ? product.images : [PLACEHOLDER]
  const inStock = product.stock > 0

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity)
  }

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity)
    navigate('/cart')
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.productLayout}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.thumbnails}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === selectedImg ? styles.activeThumb : ''}`}
                  onClick={() => setSelectedImg(i)}
                >
                  <img src={img} alt={`view ${i+1}`} onError={e => { e.target.src = PLACEHOLDER }} />
                </button>
              ))}
            </div>
            <div className={styles.mainImage}>
              <img
                src={images[selectedImg]}
                alt={product.name}
                onError={e => { e.target.src = PLACEHOLDER }}
              />
              <button
                className={styles.wishlistBtn}
                onClick={() => toggleWishlist(product.id)}
                aria-label="Add to wishlist"
              >
                {wishlisted ? <FaHeart color="#ff6161" size={22} /> : <FiHeart size={22} />}
              </button>
            </div>

            {/* Action Buttons (sticky on desktop) */}
            <div className={styles.actionButtons}>
              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <FiShoppingCart size={20} />
                ADD TO CART
              </button>
              <button
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
                disabled={!inStock}
              >
                <FiZap size={20} />
                BUY NOW
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className={styles.detailsSection}>
            <p className={styles.brand}>{product.brand}</p>
            <h1 className={styles.productName}>{product.name}</h1>

            {product.rating > 0 && (
              <div className={styles.ratingRow}>
                <span className={styles.ratingBadge}>
                  {product.rating} <FaStar size={12} />
                </span>
                <span className={styles.reviewCount}>{product.reviewCount?.toLocaleString()} Ratings & Reviews</span>
              </div>
            )}

            <div className={styles.pricingSection}>
              <span className={styles.price}>₹{Number(product.price).toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <>
                  <span className={styles.originalPrice}>₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
                  <span className={styles.discount}>{product.discount}% off</span>
                </>
              )}
            </div>

            <div className={styles.stockStatus}>
              {inStock
                ? <span className={styles.inStock}>✓ In Stock ({product.stock} available)</span>
                : <span className={styles.outOfStock}>✗ Out of Stock</span>
              }
            </div>

            {/* Quantity */}
            {inStock && (
              <div className={styles.quantityRow}>
                <span>Quantity:</span>
                <div className={styles.quantityControl}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            {/* Offers */}
            <div className={styles.offersSection}>
              <h3>Available Offers</h3>
              <ul>
                <li>🏦 Bank Offer: 10% off on HDFC Bank Credit Cards</li>
                <li>💳 No Cost EMI on select cards</li>
                <li>🎁 Extra ₹500 off on first order</li>
              </ul>
            </div>

            {/* Delivery */}
            <div className={styles.deliverySection}>
              <div className={styles.deliveryItem}>
                <FiTruck size={18} color="#388e3c" />
                <div>
                  <strong>Free Delivery</strong>
                  <p>Delivery by {getDeliveryDate()}</p>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <FiShield size={18} color="#2874f0" />
                <div>
                  <strong>1 Year Warranty</strong>
                  <p>Manufacturer warranty</p>
                </div>
              </div>
              <div className={styles.deliveryItem}>
                <FiRefreshCw size={18} color="#ff9f00" />
                <div>
                  <strong>7 Days Return</strong>
                  <p>Easy return policy</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className={styles.descriptionSection}>
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className={styles.specsSection}>
                <h3>Specifications</h3>
                <table className={styles.specsTable}>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td className={styles.specKey}>{key}</td>
                        <td className={styles.specVal}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getDeliveryDate() {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}
