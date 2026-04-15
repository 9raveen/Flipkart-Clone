import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ordersAPI } from '../api'
import styles from './OrderHistoryPage.module.css'

const STATUS_COLORS = {
  confirmed: '#2874f0',
  pending: '#ff9f00',
  shipped: '#ff9f00',
  delivered: '#388e3c',
  cancelled: '#ff6161',
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersAPI.getAll()
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Orders</h1>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <p>No orders yet.</p>
            <Link to="/products" className={styles.shopBtn}>Start Shopping</Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <p className={styles.orderNumber}>Order #{order.orderNumber || order.id.slice(0, 8)}</p>
                    <p className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className={styles.orderMeta}>
                    <span
                      className={styles.statusBadge}
                      style={{ background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}
                    >
                      {order.status?.toUpperCase()}
                    </span>
                    <span className={styles.orderTotal}>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items?.map(item => (
                    <div key={item.id} className={styles.orderItem}>
                      <span className={styles.itemName}>{item.productName}</span>
                      <span className={styles.itemQty}>Qty: {item.quantity}</span>
                      <span className={styles.itemPrice}>₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <p className={styles.paymentMethod}>Payment: {order.paymentMethod}</p>
                  <Link to={`/order-confirmation/${order.id}`} className={styles.viewBtn}>
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
