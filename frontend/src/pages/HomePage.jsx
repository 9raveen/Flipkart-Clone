import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI, categoriesAPI } from '../api'
import ProductCard from '../components/ProductCard/ProductCard'
import styles from './HomePage.module.css'

const BANNER_IMAGES = [
  'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/7c9b0b0b0b0b0b0b.jpg',
  'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/8c9b0b0b0b0b0b0b.jpg',
]

const CATEGORY_ICONS = [
  { name: 'Mobiles', slug: 'mobiles', img: 'https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png' },
  { name: 'Electronics', slug: 'electronics', img: 'https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png' },
  { name: 'Fashion', slug: 'fashion', img: 'https://rukminim2.flixcart.com/flap/80/80/image/c12afc017e6f24cb.png' },
  { name: 'Appliances', slug: 'appliances', img: 'https://rukminim2.flixcart.com/flap/80/80/image/0ff199d1bd27eb98.png' },
  { name: 'Furniture', slug: 'furniture', img: 'https://rukminim2.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg' },
  { name: 'Books', slug: 'books', img: 'https://rukminim2.flixcart.com/flap/80/80/image/71050627a56b4693.png' },
  { name: 'Sports', slug: 'sports', img: 'https://rukminim2.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png' },
  { name: 'Beauty', slug: 'beauty', img: 'https://rukminim2.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [bannerIdx, setBannerIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsAPI.getFeatured()
      .then(r => setFeatured(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % 3), 4000)
    return () => clearInterval(timer)
  }, [])

  const bannerColors = ['#2874f0', '#ff6161', '#388e3c']

  return (
    <div className={styles.page}>
      {/* Hero Banner */}
      <div className={styles.bannerSection}>
        <div className={styles.banner} style={{ background: bannerColors[bannerIdx] }}>
          <div className={styles.bannerContent}>
            <h1>Big Billion Days Sale</h1>
            <p>Up to 80% off on top brands</p>
            <Link to="/products" className={styles.shopNowBtn}>Shop Now</Link>
          </div>
          <div className={styles.bannerDots}>
            {[0,1,2].map(i => (
              <button
                key={i}
                className={`${styles.dot} ${i === bannerIdx ? styles.activeDot : ''}`}
                onClick={() => setBannerIdx(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Strip */}
      <div className={styles.categoryStrip}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.categoryGrid}>
            {CATEGORY_ICONS.map(cat => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} className={styles.categoryItem}>
                <div className={styles.categoryImgWrapper}>
                  <img src={cat.img} alt={cat.name} onError={e => { e.target.style.display='none' }} />
                </div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <Link to="/products" className={styles.viewAll}>View All →</Link>
          </div>
          {loading ? (
            <div className={styles.skeletonGrid}>
              {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : (
            <div className={styles.productGrid}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>

        {/* Promo Banners */}
        <div className={styles.promoBanners}>
          <Link to="/products?category=mobiles" className={styles.promoBanner} style={{ background: 'linear-gradient(135deg, #1a237e, #2874f0)' }}>
            <h3>Mobiles</h3>
            <p>Up to 40% off</p>
          </Link>
          <Link to="/products?category=electronics" className={styles.promoBanner} style={{ background: 'linear-gradient(135deg, #b71c1c, #ff6161)' }}>
            <h3>Electronics</h3>
            <p>Best deals today</p>
          </Link>
          <Link to="/products?category=fashion" className={styles.promoBanner} style={{ background: 'linear-gradient(135deg, #1b5e20, #388e3c)' }}>
            <h3>Fashion</h3>
            <p>Min 50% off</p>
          </Link>
        </div>

        {/* All Products Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Products</h2>
            <Link to="/products" className={styles.viewAll}>View All →</Link>
          </div>
          <AllProducts />
        </div>
      </div>
    </div>
  )
}

function AllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsAPI.getAll({ limit: 12 })
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className={styles.skeletonGrid}>
      {[...Array(8)].map((_, i) => <div key={i} className={styles.skeleton} />)}
    </div>
  )

  return (
    <div className={styles.productGrid}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
