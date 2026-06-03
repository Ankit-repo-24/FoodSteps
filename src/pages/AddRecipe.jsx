import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    cuisine: "American",
    diet: "",
    difficulty: "Easy",
    ingredients: [""],
    instructions: [""]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Dynamic lists handlers
  const handleListChange = (index, value, type) => {
    const newList = [...formData[type]];
    newList[index] = value;
    setFormData((prev) => ({
      ...prev,
      [type]: newList
    }));
  };

  const addListItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ""]
    }));
  };

  const removeListItem = (index, type) => {
    const newList = [...formData[type]];
    newList.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      [type]: newList
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanIngredients = formData.ingredients.filter((i) => i.trim() !== "");
      const cleanInstructions = formData.instructions.filter((i) => i.trim() !== "");
      
      const payload = {
        ...formData,
        ingredients: cleanIngredients,
        instructions: cleanInstructions
      };

      await api.createRecipe(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Create Gourmet Masterpiece
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Share your culinary magic with the world by building a custom cooking card.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 flex items-center space-x-3 text-green-700 dark:text-green-400">
          <CheckCircleIcon className="h-6 w-6" />
          <span className="font-semibold">Recipe added successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6">
        {/* Core fields */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Recipe Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Grandma's Famous Pasta Sauce"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Give a short summary of how this recipe tastes, looks, and its origins..."
              value={formData.description}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/... (or leave blank for default image)"
              value={formData.image}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Nutritional & Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Prep Time (mins)</label>
            <input
              type="number"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleInputChange}
              min={1}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Cook Time (mins)</label>
            <input
              type="number"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleInputChange}
              min={0}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Servings</label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleInputChange}
              min={1}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Cuisine</label>
            <input
              type="text"
              name="cuisine"
              placeholder="e.g. Italian, Indian, Mexican"
              value={formData.cuisine}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Diet Type</label>
            <input
              type="text"
              name="diet"
              placeholder="e.g. Vegan, Low-Carb, Gluten-Free"
              value={formData.diet}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Dynamic Ingredients */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ingredients</label>
            <button
              type="button"
              onClick={() => addListItem("ingredients")}
              className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Ingredient</span>
            </button>
          </div>
          <div className="space-y-2">
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  required
                  placeholder={`Ingredient ${idx + 1}`}
                  value={ing}
                  onChange={(e) => handleListChange(idx, e.target.value, "ingredients")}
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(idx, "ingredients")}
                    className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Instructions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cooking Steps</label>
            <button
              type="button"
              onClick={() => addListItem("instructions")}
              className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Step</span>
            </button>
          </div>
          <div className="space-y-2">
            {formData.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="mt-2.5 text-xs font-bold text-gray-400 w-5">#{idx + 1}</span>
                <textarea
                  required
                  rows={2}
                  placeholder={`Step ${idx + 1} instructions...`}
                  value={step}
                  onChange={(e) => handleListChange(idx, e.target.value, "instructions")}
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(idx, "instructions")}
                    className="p-2.5 mt-1 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer text-sm tracking-wide"
          >
            Create Gourmet Recipe
          </button>
        </div>
      </form>
    </div>
  );
}
