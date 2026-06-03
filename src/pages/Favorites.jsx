import React, { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import RecipeCard from "../components/RecipeCard.jsx";
import { api } from "../services/api";

export default function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favIds = api.getFavorites();
      const promises = favIds.map(async (id) => {
        try {
          return await api.getRecipeById(id);
        } catch (e) {
          console.error(`Failed to fetch favorite recipe ID: ${id}`, e);
          return null;
        }
      });
      const results = await Promise.all(promises);
      setFavoriteRecipes(results.filter(Boolean));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleFavoriteToggle = () => {
    // Reload state after favoriting changes
    loadFavorites();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-500">
          <HeartIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Your Bookmarks
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A beautiful collection of your favorite recipes, ready to cook.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm animate-pulse h-80"
            />
          ))}
        </div>
      ) : favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <span className="text-4xl text-gray-300">💖</span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            No Bookmarked Recipes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Tap the heart icon on any recipe cards to pin them here for quick access later!
          </p>
        </div>
      )}
    </div>
  );
}
