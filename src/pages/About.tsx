import { useApp } from '../context/AppContext';
import { Award, Leaf, HeartHandshake, ArrowRight } from 'lucide-react';

export default function About() {
  const { navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
          Our Culinary Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-stone-900 tracking-tight text-balance">
          Bridging Michelin-standard craft with modern doorstep delivery.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Founded in 2021 in San Francisco's historic Mission District, SAVOR was built on a single question: Why should takeout food ever feel like a compromise?
        </p>
      </div>

      {/* Narrative Section with Split Image */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-2xs">
        <div className="md:col-span-6 space-y-4">
          <span className="text-xs font-mono font-semibold text-amber-700 uppercase">
            01. The Kitchen Philosophy
          </span>
          <h2 className="text-2xl font-bold font-display text-stone-900">
            72-Hour Fermentations & Sustainable Harvests
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every pizza dough begins 3 days prior with our heritage mother yeast culture. Our burger patties are freshly grounded each sunrise from American Wagyu and pasture-finished chuck. We reject food warming lamps and pre-cooked batches; your ticket enters the line only when ordered.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('menu')}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Explore The Dishes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="md:col-span-6 aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
          <img
            src="/src/assets/images/hero_food_platter_1792442076978.jpg"
            alt="Kitchen preparation"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Sourcing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200/80 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">Zero Frozen Ingredients</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Produce from Petaluma, Sebastopol, and Salinas Valley arrives by truck every morning before 6:00 AM.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200/80 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">Certified Responsible Fishery</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Our Atlantic salmon and Yellowfin tuna hold Monterey Bay Aquarium Seafood Watch green ratings.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200/80 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">Fair Kitchen Living Wage</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            All culinary and transport team members receive fair hourly compensation, healthcare stipends, and continuous career growth.
          </p>
        </div>
      </div>
    </div>
  );
}
