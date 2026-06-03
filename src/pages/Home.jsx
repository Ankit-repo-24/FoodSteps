import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Filters from "../components/Filters.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import { api } from "../services/api";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    cuisine: "",
    diet: "",
    difficulty: "",
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await api.getAllRecipes(filters);
        setRecipes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-800 text-white p-8 md:p-14 shadow-xl">
        {/* Background Decorative Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-purple-300 to-indigo-900"></div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 uppercase tracking-widest text-amber-300">
            Welcome to GourmetBox
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Discover & Cook <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">
              Premium Recipes
            </span>
          </h1>
          <p className="text-purple-100/95 text-base md:text-lg leading-relaxed max-w-xl">
            Unleash your inner chef with a rich collection of gourmet recipes, interactive timers, and easy customized diet filtering.
          </p>

          {/* Search bar inside Hero */}
          <div className="relative max-w-lg mt-8 shadow-lg rounded-2xl overflow-hidden bg-white/15 backdrop-blur-lg border border-white/30">
            <span className="absolute inset-y-0 left-5 flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 text-amber-300" />
            </span>
            <input
              type="text"
              placeholder="Search recipes, cuisines or ingredients..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full bg-transparent pl-16 pr-5 py-4 text-base text-white placeholder-purple-200/70 focus:outline-none transition-all"
            />
          </div>

          {/* Quick Search Tag Suggestions */}
          <div className="flex flex-wrap gap-3 mt-6 items-center">
            <span className="text-sm text-purple-200/80 font-semibold">Quick Search:</span>
            {[
              { label: "🍗 Chicken", query: "chicken" },
              { label: "🥗 Salad", query: "salad" },
              { label: "🍝 Pasta", query: "pasta" },
              { label: "🍰 Cake", query: "cake" },
              { label: "🍤 Shrimp", query: "shrimp" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setFilters((prev) => ({ ...prev, search: item.query }))}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 border border-white/30 hover:scale-105 active:scale-95 transition-all text-white cursor-pointer shadow-sm"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero visual food art image floating on right (desktop only) */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
            alt="Delicious bowl of healthy food"
            className="w-full h-full object-cover animate-spin-slow"
          />
        </div>
      </div>

      {/* Filter Component */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Refine Your Search</h3>
        <Filters filters={filters} setFilters={setFilters} />
      </div>

      {/* Recipe List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700/50 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Latest Masterpieces
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Showing <span className="font-bold text-gray-700 dark:text-gray-300">{recipes.length}</span> delicious recipes
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 recipe-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm animate-pulse h-80"
              />
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-6xl">🍳</span>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                No Recipes Found
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 max-w-md">
                We couldn't find any recipes matching your filters. Try adjusting your search or clearing filters to discover more delicious options!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
