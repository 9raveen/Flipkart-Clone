import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import styles from './CartPage.module.css'

const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=No+Image'

export default function CartPage() {
  const { cartItems, cartTotal, cartOriginalTotal, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  const savings = cartOriginalTotal - cartTotal
  const deliveryCharge = cartTotal > 500 ? 0 : 40

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <FiShoppingBag size={80} color="#e0e0e0" />
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <Link to="/products" className={styles.shopBtn}>Shop Now</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Cart Items */}
        <div className={styles.cartSection}>
          <div className={styles.cartHeader}>
            <h2>My Cart ({cartItems.length})</h2>
          </div>

          {cartItems.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <Link to={`/products/${item.productId}`} className={styles.itemImage}>
                <img
                  src={item.product?.images?.[0] || PLACEHOLDER}
                  alt={item.product?.name}
                  onError={e => { e.target.src = PLACEHOLDER }}
                />
              </Link>

              <div className={styles.itemDetails}>
                <Link to={`/products/${item.productId}`} className={styles.itemName}>
                  {item.product?.name}
                </Link>
                {item.product?.brand && <p className={styles.itemBrand}>{item.product.brand}</p>}

                <div className={styles.itemPricing}>
                  <span className={styles.itemPrice}>₹{Number(item.product?.price).toLocaleString('en-IN')}</span>
                  {item.product?.originalPrice && (
                    <>
                      <span className={styles.itemOriginalPrice}>₹{Number(item.product.originalPrice).toLocaleString('en-IN')}</span>
                      <span className={styles.itemDiscount}>{item.product.discount}% off</span>
                    </>
                  )}
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    <FiTrash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className={styles.cartFooter}>
            <button className={styles.placeOrderBtn} onClick={() => navigate('/checkout')}>
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className={styles.summarySection}>
          <div className={styles.summaryBox}>
            <h3 className={styles.summaryTitle}>PRICE DETAILS</h3>
            <div className={styles.summaryRow}>
              <span>Price ({cartItems.length} items)</span>
              <span>₹{cartOriginalTotal.toLocaleString('en-IN')}</span>
            </div>
            {savings > 0 && (
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span className={styles.savingsText}>− ₹{savings.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>Delivery Charges</span>
              <span className={deliveryCharge === 0 ? styles.freeText : ''}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total Amount</span>
              <span>₹{(cartTotal + deliveryCharge).toLocaleString('en-IN')}</span>
            </div>
            {savings > 0 && (
              <p className={styles.savingsSummary}>You will save ₹{savings.toLocaleString('en-IN')} on this order</p>
            )}
          </div>

          <div className={styles.safetyBadge}>
            🔒 Safe and Secure Payments. Easy returns. 100% Authentic products.
          </div>
        </div>
      </div>
    </div>
  )
}
