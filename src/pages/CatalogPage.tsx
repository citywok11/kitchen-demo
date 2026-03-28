import { useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { ProductCard } from '../components/ProductCard/ProductCard'
import './CatalogPage.css'

export function CatalogPage() {
  const navigate = useNavigate()

  return (
    <div className="catalog-page">
      <header className="catalog-page__header">
        <h1 className="catalog-page__title">All Products</h1>
      </header>
      <div className="catalog-page__grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
