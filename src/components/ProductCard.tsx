import { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';
import { useApp } from '../context/AppContext';
import { Plus, SlidersHorizontal, Utensils } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenCustomizer?: (product: Product) => void;
}

export default function ProductCard({ product, onOpenCustomizer }: ProductCardProps) {
  const { addToCart, setActiveModalProduct } = useApp();
  const [imgError, setImgError] = useState(false);

  const hasOptions = product.optionGroups && product.optionGroups.length > 0;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasOptions || onOpenCustomizer) {
      if (onOpenCustomizer) {
        onOpenCustomizer(product);
      } else {
        setActiveModalProduct(product);
      }
    } else {
      addToCart(product, 1);
    }
  };

  const handleCardClick = () => {
    setActiveModalProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Product Image Frame (65-75% visual weight) */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4">
            <Utensils className="w-8 h-8 stroke-1 text-stone-400 mb-2" />
            <span className="text-xs font-medium text-stone-500 text-center">
              {product.name}
            </span>
          </div>
        )}

        {/* Quiet top status flag if out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-semibold tracking-wider uppercase text-white bg-stone-950/80 px-3 py-1 rounded">
              Sold Out Today
            </span>
          </div>
        )}

        {/* Quick prep time badge indicator */}
        <div className="absolute bottom-2.5 left-2.5 text-[11px] font-medium text-stone-800 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-xs">
          {product.prepTimeMinutes} min prep
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Section 1.A: Unboxed metadata with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 uppercase tracking-wider font-medium">
            <span>{product.category}</span>
            {product.dietaryTags.length > 0 && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-stone-600 normal-case">
                  {product.dietaryTags[0].replace('-', ' ')}
                </span>
              </>
            )}
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-600 normal-case tabular-nums font-mono">
              {product.calories} kcal
            </span>
          </div>

          <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Card Footer: Price & Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-stone-950 font-mono tabular-nums">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAction}
            disabled={!product.inStock}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              !product.inStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : hasOptions
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
            }`}
          >
            {hasOptions ? (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
