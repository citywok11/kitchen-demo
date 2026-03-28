import type { Product } from '../../data/products'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <article className="product-card" onClick={onClick} role="article">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src={product.imagePath}
          alt={product.name}
        />
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        <span className="product-card__price">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </article>
  )
}
