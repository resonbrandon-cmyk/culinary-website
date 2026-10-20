import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from './AdminLayout';
import { Product, Category, DietaryTag } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Plus, Edit2, Trash2, Check, X, Search, SlidersHorizontal } from 'lucide-react';

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New item form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('burgers');
  const [price, setPrice] = useState('18.00');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('15');
  const [calories, setCalories] = useState('650');
  const [image, setImage] = useState('/src/assets/images/product_wagyu_burger_1792442077902.jpg');
  const [selectedTags, setSelectedTags] = useState<DietaryTag[]>(['chef-special']);

  const availableTags: DietaryTag[] = ['chef-special', 'vegetarian', 'vegan', 'gluten-free', 'halal', 'organic'];

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    addProduct({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      category,
      price: parseFloat(price) || 15.0,
      prepTimeMinutes: parseInt(prepTimeMinutes, 10) || 15,
      calories: parseInt(calories, 10) || 500,
      dietaryTags: selectedTags,
      image,
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      featured: false,
    });

    setName('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: editingProduct.price,
      description: editingProduct.description,
      prepTimeMinutes: editingProduct.prepTimeMinutes,
    });

    setEditingProduct(null);
  };

  return (
    <AdminLayout activeTab="products">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl font-bold font-display text-stone-900">
              Menu & Inventory Management
            </h1>
            <p className="text-xs text-stone-500">
              Configure dishes, adjust live pricing, and 86 sold-out ingredients immediately.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog dishes..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {(['all', 'burgers', 'pizzas', 'bowls', 'sushi', 'sides', 'drinks', 'desserts'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors capitalize ${
                    categoryFilter === cat
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Catalog Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Item & Description</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 font-mono">Price</th>
                  <th className="p-4">Prep / Kcal</th>
                  <th className="p-4">Kitchen Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* Item */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block text-sm">
                            {product.name}
                          </span>
                          <span className="text-stone-400 line-clamp-1 max-w-xs text-[11px]">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="capitalize font-medium text-stone-700">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-mono font-bold text-stone-900 tabular-nums">
                      {formatCurrency(product.price)}
                    </td>

                    {/* Prep/Kcal */}
                    <td className="p-4 font-mono text-[11px]">
                      <div>{product.prepTimeMinutes} mins</div>
                      <div className="text-stone-400">{product.calories} kcal</div>
                    </td>

                    {/* Availability Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => toggleStock(product.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          product.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {product.inStock ? 'In Stock · Ready' : '86\'d · Sold Out'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${product.name}" from catalog?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h2 className="text-base font-bold font-display text-stone-900">
                Add New Dish to Catalog
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Crispy Duck Bao Buns"
                  className="w-full p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-white"
                  >
                    <option value="burgers">Burgers</option>
                    <option value="pizzas">Pizzas</option>
                    <option value="bowls">Bowls</option>
                    <option value="sushi">Sushi</option>
                    <option value="sides">Sides</option>
                    <option value="drinks">Drinks</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Culinary Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredient details, preparation notes, allergen advice..."
                  className="w-full p-2.5 rounded-lg border border-stone-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Calories (Kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 font-mono"
                  />
                </div>
              </div>

              {/* Dietary Tags Checkboxes */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dietary Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag));
                          } else {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg shadow-xs"
                >
                  Create Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h2 className="text-base font-bold font-display text-stone-900">
                Edit {editingProduct.name}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full p-2.5 rounded-lg border border-stone-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={editingProduct.prepTimeMinutes}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        prepTimeMinutes: parseInt(e.target.value, 10) || 15,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-stone-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-stone-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white font-bold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
