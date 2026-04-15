import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ordersAPI } from '../api'
import styles from './OrderConfirmationPage.module.css'

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const { state } = useLocation()
  const [order, setOrder] = useState(state?.order || null)
  const [loading, setLoading] = useState(!state?.order)

  useEffect(() => {
    if (!order) {
      ordersAPI.getById(orderId)
        .then(r => setOrder(r.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [orderId])

  if (loading) return <div className={styles.loading}>Loading...</div>
  if (!order) return <div className={styles.loading}>Order not found</div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
          <p className={styles.successMsg}>
            Your order has been confirmed. You'll receive a confirmation email shortly.
          </p>

          <div className={styles.orderIdBox}>
            <span>Order ID:</span>
            <strong>{order.orderNumber || order.id}</strong>
          </div>

          <div className={styles.orderDetails}>
            <div className={styles.detailRow}>
              <span>Status</span>
              <span className={styles.statusBadge}>{order.status?.toUpperCase()}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Payment Method</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Total Amount</span>
              <strong>₹{Number(order.totalAmount).toLocaleString('en-IN')}</strong>
            </div>
            {order.shippingAddress && (
              <div className={styles.detailRow}>
                <span>Deliver to</span>
                <span>
                  {order.shippingAddress.name}, {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </span>
              </div>
            )}
          </div>

          {order.items?.length > 0 && (
            <div className={styles.itemsList}>
              <h3>Items Ordered</h3>
              {order.items.map(item => (
                <div key={item.id} className={styles.orderItem}>
                  <span className={styles.itemName}>{item.productName}</span>
                  <span>x{item.quantity}</span>
                  <span>₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.deliveryInfo}>
            <span>🚚</span>
            <p>Expected delivery by <strong>{getDeliveryDate()}</strong></p>
          </div>

          <div className={styles.actions}>
            <Link to="/orders" className={styles.viewOrdersBtn}>View All Orders</Link>
            <Link to="/" className={styles.continueBtn}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function getDeliveryDate() {
  const d = new Date()
  d.setDate(d.getDate() + 5)
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}
