import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Category } from '../types';
import { ArrowRight, Sparkles, Shield, Clock, Award, Leaf } from 'lucide-react';

export default function Home() {
  const { navigate, products } = useApp();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  const categoriesList: { id: Category; label: string; icon: string }[] = [
    { id: 'burgers', label: 'Wagyu Burgers', icon: '🍔' },
    { id: 'pizzas', label: 'Woodfired Pizza', icon: '🍕' },
    { id: 'bowls', label: 'Nourish Bowls', icon: '🥗' },
    { id: 'sushi', label: 'Omakase Sushi', icon: '🍣' },
    { id: 'sides', label: 'Artisan Sides', icon: '🍟' },
    { id: 'drinks', label: 'Craft Drinks', icon: '🍋' },
    { id: 'desserts', label: 'Pastry & Sweets', icon: '🍰' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40 z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chef-Crafted Artisanal Kitchen</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.08] text-white max-w-2xl text-balance">
                Culinary mastery, delivered warm to your dining table.
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed">
                Experience dry-aged Wagyu patties, 72-hour naturally fermented pizza crusts, and line-caught sashimi prepared by Michelin-trained kitchen teams.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('menu')}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Explore Kitchen Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('about')}
                  className="px-5 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
                >
                  Our Sourcing Philosophy
                </button>
              </div>

              {/* Service metrics strip */}
              <div className="pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-2xl font-bold font-display text-white font-mono tabular-nums">22 min</div>
                  <div className="text-xs text-stone-400 mt-0.5">Average delivery speed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-white font-mono tabular-nums">4.94 ★</div>
                  <div className="text-xs text-stone-400 mt-0.5">Over 1,200 local reviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-white font-mono tabular-nums">100%</div>
                  <div className="text-xs text-stone-400 mt-0.5">Compostable packaging</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-800 aspect-[4/3] lg:aspect-[1/1] group">
                <img
                  src="/src/assets/images/hero_food_platter_1792442076978.jpg"
                  alt="Artisanal food banquet spread"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md p-3.5 rounded-xl border border-stone-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                      Featured This Evening
                    </span>
                    <span className="text-sm font-bold text-white">
                      The Reserve Tasting Selection
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('menu')}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors whitespace-nowrap"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Browser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-stone-900">
              Explore by Category
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select a section to dive directly into our current kitchen offerings
            </p>
          </div>
          <button
            onClick={() => navigate('menu')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('menu')}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-400 hover:shadow-md transition-all text-center flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-xs font-semibold text-stone-800 group-hover:text-amber-800 transition-colors">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Chef's Signature Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              Seasonal Specials
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              Chef's Reserve Creations
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl">
              Limited batch items prepared with today's market arrivals. Handcrafted in limited portions each dinner service.
            </p>
          </div>
          <button
            onClick={() => navigate('menu')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Sourcing & Quality Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 lg:p-12 border border-stone-800">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Uncompromising Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Why dining with SAVOR feels distinctly different.
            </h2>
            <p className="text-stone-300 text-sm mt-2 leading-relaxed">
              We eliminated the compromises of traditional delivery by re-engineering temperature preservation, ingredient freshness, and kitchen batching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-stone-800">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Regenerative Family Farms</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Heirloom tomatoes, organic herbs, and pastured cattle sourced exclusively within a 150-mile radius of the kitchen.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Micro-Batch Sourdough & Ferments</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Every pizza dough undergoes 72 hours of cold fermentation, resulting in an airy, blistered crust that stays crisp during transit.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Insulated Thermal Delivery</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Proprietary steam-vented compostable containers maintain optimal internal humidity so burger buns never soften and fries retain their crunch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            Real Customer Praise
          </div>
          <h2 className="text-2xl font-bold font-display text-stone-900">
            Loved by Neighborhood Food Lovers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "The Wagyu burger arrived piping hot with cheese still bubbling. Hands down the highest quality delivery experience I've had in the Bay Area."
            </p>
            <div className="pt-2 text-xs font-semibold text-stone-900">
              Marcus Chen <span className="text-stone-400 font-normal">· Verified Guest</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "Live courier tracking let me see the driver pull up right to the gate. The truffle pizza crust was blistered and smoky, just like dining inside."
            </p>
            <div className="pt-2 text-xs font-semibold text-stone-900">
              Sarah Jenkins <span className="text-stone-400 font-normal">· Verified Guest</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "The salmon poke bowl was crisp and sashimi-grade fresh. Love that I can customize grains and spice level seamlessly."
            </p>
            <div className="pt-2 text-xs font-semibold text-stone-900">
              Liam O'Connor <span className="text-stone-400 font-normal">· Verified Guest</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
              Ready to savor tonight's dinner?
            </h3>
            <p className="text-sm text-stone-900/90 max-w-lg">
              Place your order now for instant dispatch or schedule a delivery time for your evening gathering.
            </p>
          </div>
          <button
            onClick={() => navigate('menu')}
            className="px-6 py-3.5 bg-stone-950 hover:bg-stone-900 text-amber-400 font-bold text-sm rounded-xl transition-colors shadow-lg whitespace-nowrap"
          >
            Start Your Order
          </button>
        </div>
      </section>
    </div>
  );
}
