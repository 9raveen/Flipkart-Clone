import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiChevronDown } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import styles from './Navbar.module.css'

const NAV_CATEGORIES = [
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Mobiles', slug: 'mobiles' },
  { label: 'Fashion', slug: 'fashion' },
  { label: 'Appliances', slug: 'appliances' },
  { label: 'Furniture', slug: 'furniture' },
  { label: 'Books', slug: 'books' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Beauty', slug: 'beauty' },
]

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>Flipkart</span>
            <span className={styles.logoTagline}>
              <em>Explore</em> <span className={styles.plus}>Plus</span>
            </span>
          </Link>

          {/* Search */}
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>
              <FiSearch size={20} />
            </button>
          </form>

          {/* Nav Actions */}
          <nav className={styles.navActions}>
            <div className={styles.navItem}>
              <FiUser size={18} />
              <span>Account</span>
              <FiChevronDown size={14} />
            </div>

            <Link to="/orders" className={styles.navItem}>
              <span>Orders</span>
            </Link>

            <Link to="/wishlist" className={styles.navItem}>
              <FiHeart size={18} />
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className={styles.cartBtn}>
              <div className={styles.cartIcon}>
                <FiShoppingCart size={20} />
                {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              </div>
              <span>Cart</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Category Bar */}
      <div className={styles.categoryBar}>
        <div className={styles.container}>
          {NAV_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className={styles.categoryLink}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
