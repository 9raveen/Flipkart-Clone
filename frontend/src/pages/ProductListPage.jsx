import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productsAPI, categoriesAPI } from '../api'
import ProductCard from '../components/ProductCard/ProductCard'
import styles from './ProductListPage.module.css'

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'popularity', label: 'Popularity' },
]

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await productsAPI.getAll({ search, category, sort, minPrice, maxPrice, page, limit: 20 })
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [search, category, sort, minPrice, maxPrice, page])

  useEffect(() => {
    categoriesAPI.getAll().then(r => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, category, sort, minPrice, maxPrice])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams)
    if (value) params[key] = value
    else delete params[key]
    setSearchParams(params)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterBox}>
            <h3 className={styles.filterTitle}>Filters</h3>

            <div className={styles.filterSection}>
              <h4>Category</h4>
              <label className={styles.filterOption}>
                <input type="radio" name="cat" checked={!category} onChange={() => updateParam('category', '')} />
                All
              </label>
              {categories.map(cat => (
                <label key={cat.id} className={styles.filterOption}>
                  <input type="radio" name="cat" checked={category === cat.slug} onChange={() => updateParam('category', cat.slug)} />
                  {cat.name}
                </label>
              ))}
            </div>

            <div className={styles.filterSection}>
              <h4>Price Range</h4>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => updateParam('minPrice', e.target.value)}
                  className={styles.priceInput}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => updateParam('maxPrice', e.target.value)}
                  className={styles.priceInput}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Top Bar */}
          <div className={styles.topBar}>
            <p className={styles.resultCount}>
              {search ? `Results for "${search}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
              {!loading && <span> — {total} items</span>}
            </p>
            <div className={styles.sortBar}>
              <span>Sort by:</span>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`${styles.sortBtn} ${sort === opt.value ? styles.activeSortBtn : ''}`}
                  onClick={() => updateParam('sort', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className={styles.grid}>
              {[...Array(12)].map((_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <p>No products found.</p>
              <button onClick={() => setSearchParams({})}>Clear filters</button>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {total > 20 && (
                <div className={styles.pagination}>
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <span>Page {page} of {Math.ceil(total / 20)}</span>
                  <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
