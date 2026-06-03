import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, ClockIcon, StarIcon, FireIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";

export default function RecipeCard({ recipe, onFavoriteToggle }) {
  const [isFav, setIsFav] = useState(api.isFavorite(recipe.id));

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    api.toggleFavorite(recipe.id);
    setIsFav(!isFav);
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Recipe Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-white bg-black/40 backdrop-blur-md">
            {recipe.cuisine}
          </span>
          {recipe.diet && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-purple-200 bg-purple-900/60 backdrop-blur-md">
              {recipe.diet}
            </span>
          )}
          {recipe.fitnessArchetype && (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-emerald-200 bg-emerald-950/80 backdrop-blur-md">
              {recipe.fitnessArchetype}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 text-red-500 shadow-md backdrop-blur-sm scale-100 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {isFav ? (
            <HeartIcon className="h-5 w-5 fill-current" />
          ) : (
            <HeartOutlineIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Card Info */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-2">
          {/* Difficulty badge */}
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
              recipe.difficulty === "Easy"
                ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                : recipe.difficulty === "Medium"
                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
            }`}
          >
            {recipe.difficulty}
          </span>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {recipe.rating}
            </span>
            <span className="text-xs text-gray-400">({recipe.reviews})</span>
          </div>
        </div>

        {/* Veg/Non-Veg Indicator and Title */}
        <div className="flex items-center space-x-2.5 mb-2">
          <div 
            className={`w-4 h-4 border-2 flex items-center justify-center p-[2px] rounded-sm shrink-0 ${
              recipe.isVeg ? "border-emerald-600 bg-emerald-50/20" : "border-red-600 bg-red-50/20"
            }`}
            title={recipe.isVeg ? "Vegetarian" : "Non-Vegetarian"}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${recipe.isVeg ? "bg-emerald-600" : "bg-red-600"}`} />
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 flex-1">
            {recipe.title}
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {recipe.description}
        </p>

        {/* Cooking Info Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 text-xs">
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span>{recipe.prepTime + recipe.cookTime} mins</span>
          </div>
          <div className="flex items-center space-x-1">
            <FireIcon className="h-4 w-4 text-gray-400" />
            <span>{recipe.nutrition?.calories || 350} kcal</span>
          </div>
          <div>
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
