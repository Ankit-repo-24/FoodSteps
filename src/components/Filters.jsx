import React from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Filters({ filters, setFilters }) {
  const cuisines = ["", "Indian", "Chinese", "Italian", "Thai", "Japanese", "American", "French"];
  const diets = ["", "High-Protein", "Spicy", "Vegetarian", "Vegan", "Dessert"];
  const difficulties = ["", "Easy", "Medium", "Hard"];

  const handleSelectChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      cuisine: "",
      diet: "",
      difficulty: "",
    });
  };

  const hasActiveFilters =
    filters.cuisine || filters.diet || filters.difficulty || filters.search;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="font-bold text-gray-900 dark:text-white">Filter Recipes</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-xs text-rose-500 hover:text-rose-600 font-medium cursor-pointer transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cuisine Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Cuisine
          </label>
          <select
            value={filters.cuisine}
            onChange={(e) => handleSelectChange("cuisine", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          >
            <option value="">All Cuisines</option>
            {cuisines.filter(Boolean).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Diet Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Diet Type
          </label>
          <select
            value={filters.diet}
            onChange={(e) => handleSelectChange("diet", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          >
            <option value="">All Diets</option>
            {diets.filter(Boolean).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Difficulty
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleSelectChange("difficulty", e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          >
            <option value="">All Difficulties</option>
            {difficulties.filter(Boolean).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
