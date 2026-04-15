import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ordersAPI } from '../api'
import toast from 'react-hot-toast'
import styles from './CheckoutPage.module.css'

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { id: 'UPI', label: 'UPI', icon: '📱' },
  { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
]

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartOriginalTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [form, setForm] = useState({
    name: 'Default User',
    email: 'user@flipkart.com',
    phone: '9876543210',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const savings = cartOriginalTotal - cartTotal
  const deliveryCharge = cartTotal > 500 ? 0 : 40
  const finalTotal = cartTotal + deliveryCharge

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.address || !form.city || !form.state || !form.pincode) {
      toast.error('Please fill all address fields')
      return
    }
    setPlacing(true)
    try {
      const { data } = await ordersAPI.place({
        shippingAddress: form,
        paymentMethod,
      })
      await clearCart()
      navigate(`/order-confirmation/${data.id}`, { state: { order: data } })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.checkoutLayout}>
          {/* Left: Address + Payment */}
          <div className={styles.leftSection}>
            {/* Delivery Address */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.stepBadge}>1</span>
                DELIVERY ADDRESS
              </h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} required maxLength={6} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Address (House No, Street, Area) *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} required rows={3} />
                </div>
                <div className={styles.formGroup}>
                  <label>City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>State *</label>
                  <input name="state" value={form.state} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.stepBadge}>2</span>
                PAYMENT OPTIONS
              </h2>
              <div className={styles.paymentOptions}>
                {PAYMENT_METHODS.map(pm => (
                  <label key={pm.id} className={`${styles.paymentOption} ${paymentMethod === pm.id ? styles.activePayment : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                    />
                    <span>{pm.icon}</span>
                    <span>{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className={styles.rightSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.stepBadge}>3</span>
                ORDER SUMMARY
              </h2>
              <div className={styles.orderItems}>
                {cartItems.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                      alt={item.product?.name}
                      onError={e => { e.target.src = 'https://via.placeholder.com/60' }}
                    />
                    <div className={styles.orderItemInfo}>
                      <p className={styles.orderItemName}>{item.product?.name}</p>
                      <p className={styles.orderItemQty}>Qty: {item.quantity}</p>
                    </div>
                    <span className={styles.orderItemPrice}>
                      ₹{(Number(item.product?.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.priceSummary}>
                <div className={styles.priceRow}>
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹{cartOriginalTotal.toLocaleString('en-IN')}</span>
                </div>
                {savings > 0 && (
                  <div className={styles.priceRow}>
                    <span>Discount</span>
                    <span className={styles.green}>− ₹{savings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className={styles.priceRow}>
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? styles.green : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className={styles.priceDivider} />
                <div className={`${styles.priceRow} ${styles.totalRow}`}>
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button type="submit" className={styles.placeOrderBtn} disabled={placing}>
                {placing ? 'Placing Order...' : `PLACE ORDER — ₹${finalTotal.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
