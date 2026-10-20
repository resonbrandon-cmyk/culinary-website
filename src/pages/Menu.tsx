import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Category, DietaryTag } from '../types';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function Menu() {
  const { products } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<DietaryTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'calories' | 'time'>('featured');

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'pizzas', label: 'Pizzas' },
    { id: 'bowls', label: 'Bowls' },
    { id: 'sushi', label: 'Sushi' },
    { id: 'sides', label: 'Sides' },
    { id: 'drinks', label: 'Beverages' },
    { id: 'desserts', label: 'Desserts' },
  ];

  const dietaryTags: { id: DietaryTag | 'all'; label: string }[] = [
    { id: 'all', label: 'All Diets' },
    { id: 'chef-special', label: 'Chef Special' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'halal', label: 'Halal' },
    { id: 'organic', label: 'Organic' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Dietary filter
        if (selectedDietaryTag !== 'all' && !p.dietaryTags.includes(selectedDietaryTag)) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'calories') return a.calories - b.calories;
        if (sortBy === 'time') return a.prepTimeMinutes - b.prepTimeMinutes;
        // featured / default
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedDietaryTag, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedDietaryTag('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-stone-900">
            Artisanal Kitchen Menu
          </h1>
          <p className="mt-1 text-sm text-stone-500 max-w-xl">
            Each creation is made-to-order with ingredients from verified regional farms, crafted fresh for immediate pickup or delivery.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients, dishes..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs (Section 1.A DO: interactive filter tabs with functional handlers) */}
      <div className="space-y-4">
        {/* Category Horizontal Scroll / Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sub-Filters: Dietary + Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Dietary Selectors */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-stone-400 mr-1 hidden sm:inline">Diet:</span>
            {dietaryTags.map((tag) => {
              const isSelected = selectedDietaryTag === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => setSelectedDietaryTag(tag.id)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border border-transparent'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs text-stone-600 self-end sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 rounded-md px-2.5 py-1 text-xs font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="featured">Featured Chef Choices</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="calories">Lowest Calories</option>
              <option value="time">Fastest Preparation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Active Tag Indicator */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
        <span>
          Showing <strong className="font-mono text-stone-900 font-semibold">{filteredProducts.length}</strong> culinary dishes
        </span>
        {(selectedCategory !== 'all' || selectedDietaryTag !== 'all' || searchQuery) && (
          <button
            onClick={resetFilters}
            className="text-amber-800 hover:text-amber-900 font-semibold underline text-xs"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <SlidersHorizontal className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">
            No items matched your filters
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search terms or dietary constraints to browse our full culinary catalog.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
