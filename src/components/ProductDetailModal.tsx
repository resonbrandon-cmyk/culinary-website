import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, SelectedOption } from '../types';
import { formatCurrency } from '../utils/format';
import { X, Check, Flame, Clock, Sparkles } from 'lucide-react';

export default function ProductDetailModal() {
  const { activeModalProduct, setActiveModalProduct, addToCart, setIsCartDrawerOpen } = useApp();

  if (!activeModalProduct) return null;

  return (
    <ProductCustomizerContent
      product={activeModalProduct}
      onClose={() => setActiveModalProduct(null)}
      onAdded={() => {
        setActiveModalProduct(null);
        setIsCartDrawerOpen(true);
      }}
    />
  );
}

function ProductCustomizerContent({
  product,
  onClose,
  onAdded,
}: {
  product: Product;
  onClose: () => void;
  onAdded: () => void;
}) {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imgError, setImgError] = useState(false);

  // Initialize selections with required defaults
  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    if (product.optionGroups) {
      product.optionGroups.forEach((group) => {
        if (group.required && group.options.length > 0) {
          initial[group.id] = [group.options[0].id];
        } else {
          initial[group.id] = [];
        }
      });
    }
    return initial;
  });

  const handleRadioSelect = (groupId: string, optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [groupId]: [optionId],
    }));
  };

  const handleCheckboxToggle = (groupId: string, optionId: string, maxSelections?: number) => {
    setSelections((prev) => {
      const current = prev[groupId] || [];
      if (current.includes(optionId)) {
        return {
          ...prev,
          [groupId]: current.filter((id) => id !== optionId),
        };
      } else {
        if (maxSelections && current.length >= maxSelections) {
          // Replace oldest or keep max
          return {
            ...prev,
            [groupId]: [...current.slice(1), optionId],
          };
        }
        return {
          ...prev,
          [groupId]: [...current, optionId],
        };
      }
    });
  };

  // Convert selections map into flattened SelectedOption array
  const selectedOptionsList: SelectedOption[] = useMemo(() => {
    const list: SelectedOption[] = [];
    if (!product.optionGroups) return list;

    product.optionGroups.forEach((group) => {
      const chosenIds = selections[group.id] || [];
      chosenIds.forEach((chosenId) => {
        const option = group.options.find((o) => o.id === chosenId);
        if (option) {
          list.push({
            groupId: group.id,
            groupName: group.name,
            optionId: option.id,
            optionName: option.name,
            price: option.price,
          });
        }
      });
    });
    return list;
  }, [product, selections]);

  const unitPrice = useMemo(() => {
    const optionsSum = selectedOptionsList.reduce((acc, opt) => acc + opt.price, 0);
    return product.price + optionsSum;
  }, [product.price, selectedOptionsList]);

  const totalItemPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptionsList, specialInstructions);
    onAdded();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200">
        {/* Modal Header Bar */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-900/70 text-white hover:bg-stone-900 flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Header Image */}
          <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
            {!imgError && product.image ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                <span className="text-sm font-medium">{product.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <div className="flex items-center gap-2 text-xs text-stone-300 uppercase tracking-wider mb-1 font-medium">
                <span>{product.category}</span>
                {product.dietaryTags.map((tag) => (
                  <span key={tag}>· {tag.replace('-', ' ')}</span>
                ))}
              </div>
              <h2 className="text-2xl font-bold font-display text-white">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Meta Row: Calories, Prep, Price */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-sm">
              <div className="flex items-center gap-5 text-stone-600 text-xs">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="font-mono tabular-nums">{product.calories} calories</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span>{product.prepTimeMinutes} min preparation</span>
                </div>
              </div>
              <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                {formatCurrency(unitPrice)}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Option Groups */}
            {product.optionGroups && product.optionGroups.length > 0 && (
              <div className="space-y-6 pt-2">
                {product.optionGroups.map((group) => {
                  const isRadio = group.required && (!group.maxSelections || group.maxSelections === 1);
                  const currentSelected = selections[group.id] || [];

                  return (
                    <div key={group.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-stone-900">
                          {group.name}
                        </label>
                        <span className="text-xs text-stone-500">
                          {group.required
                            ? 'Required (Choose 1)'
                            : group.maxSelections
                            ? `Optional (Max ${group.maxSelections})`
                            : 'Optional'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {group.options.map((option) => {
                          const isSelected = currentSelected.includes(option.id);

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                if (isRadio) {
                                  handleRadioSelect(group.id, option.id);
                                } else {
                                  handleCheckboxToggle(group.id, option.id, group.maxSelections);
                                }
                              }}
                              className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-colors text-left focus:outline-none ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-50/50 text-stone-900'
                                  : 'border-stone-200 hover:border-stone-300 text-stone-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded-${
                                    isRadio ? 'full' : 'md'
                                  } border flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'border-amber-600 bg-amber-600 text-white'
                                      : 'border-stone-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="font-medium text-xs sm:text-sm">
                                  {option.name}
                                </span>
                              </div>
                              {option.price > 0 && (
                                <span className="text-xs font-mono tabular-nums text-stone-500">
                                  +{formatCurrency(option.price)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Special Instructions Note */}
            <div className="space-y-2 pt-2">
              <label htmlFor="instructions" className="block text-sm font-semibold text-stone-900">
                Special Kitchen Instructions
              </label>
              <textarea
                id="instructions"
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="E.g., dressing on the side, allergy notes, extra napkins..."
                className="w-full text-xs sm:text-sm p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none text-stone-800 placeholder:text-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-bold focus:outline-none"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 font-mono tabular-nums min-w-[2.2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-bold focus:outline-none"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 py-3 px-5 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-semibold text-sm transition-colors flex items-center justify-between shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Add to Order</span>
            <span className="font-mono tabular-nums font-bold">
              {formatCurrency(totalItemPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
