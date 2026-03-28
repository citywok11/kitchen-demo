import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../data/products'
import { useCart } from '../context/CartContext'
import './ProductDetailPage.css'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const product = id ? getProductById(id) : undefined

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-page__not-found">
          <p>Product not found</p>
          <Link to="/catalog">Back to catalog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <header className="product-detail-page__header">
        <Link to="/catalog" className="product-detail-page__back" aria-label="Back to catalog">
          &larr; Back
        </Link>
      </header>

      <div className="product-detail-page__image-wrapper">
        <img
          className="product-detail-page__image"
          src={product.imagePath}
          alt={product.name}
        />
      </div>

      <div className="product-detail-page__content">
        <div className="product-detail-page__title-row">
          <h1 className="product-detail-page__title">{product.name}</h1>
          <span className="product-detail-page__price">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="product-detail-page__specs">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="product-detail-page__spec-row">
              <span className="product-detail-page__spec-label">{key}</span>
              <span className="product-detail-page__spec-value">{value}</span>
            </div>
          ))}
        </div>

        <p className="product-detail-page__description">
          {product.description}
        </p>

        <button
          className="product-detail-page__cta"
          onClick={() => addItem(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
