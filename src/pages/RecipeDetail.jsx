import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  HeartIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  CheckIcon,
  SpeakerWaveIcon
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  // Timer states
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const data = await api.getRecipeById(id);
        setRecipe(data);
        setIsFav(api.isFavorite(data.id));
        setTimerMinutes(data.cookTime || 0);
        setTimerSeconds(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // Clean timer when unmounting or running updates
  useEffect(() => {
    return () => {
      if (timerIntervalId) clearInterval(timerIntervalId);
    };
  }, [timerIntervalId]);

  const handleFavoriteToggle = () => {
    api.toggleFavorite(recipe.id);
    setIsFav(!isFav);
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Timer logic
  const startTimer = () => {
    if (timerRunning) return;
    setTimerRunning(true);
    const id = setInterval(() => {
      setTimerSeconds((prevSec) => {
        if (prevSec > 0) {
          return prevSec - 1;
        } else {
          setTimerMinutes((prevMin) => {
            if (prevMin > 0) {
              return prevMin - 1;
            } else {
              clearInterval(id);
              setTimerRunning(false);
              // Simple audio alert or notification
              try {
                const alarm = new AudioContext();
                const osc = alarm.createOscillator();
                osc.type = "sine";
                osc.frequency.setValueAtTime(440, alarm.currentTime);
                osc.connect(alarm.destination);
                osc.start();
                osc.stop(alarm.currentTime + 1.5);
              } catch (e) {
                console.log("AudioContext blocked or unsupported", e);
              }
              alert("Cooking timer finished! Enjoy your meal!");
              return 0;
            }
          });
          return 59;
        }
      });
    }, 1000);
    setTimerIntervalId(id);
  };

  const pauseTimer = () => {
    if (!timerRunning) return;
    clearInterval(timerIntervalId);
    setTimerIntervalId(null);
    setTimerRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setTimerMinutes(recipe?.cookTime || 0);
    setTimerSeconds(0);
  };

  // TTS speaker feature for active step
  const speakStep = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-8 animate-pulse">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-3xl" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Recipe Not Found</h2>
        <Link to="/" className="text-purple-600 hover:underline mt-4 inline-block">
          Go back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-8 animate-fade-in">
      {/* Navigation & Toolbar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to recipes</span>
        </Link>

        <button
          onClick={handleFavoriteToggle}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm text-red-500 hover:scale-105 active:scale-95 transition-all cursor-pointer font-semibold text-sm"
        >
          {isFav ? (
            <>
              <HeartIcon className="h-5 w-5 fill-current" />
              <span>Favorited</span>
            </>
          ) : (
            <>
              <HeartOutlineIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Save to Favorites</span>
            </>
          )}
        </button>
      </div>

      {/* Main Header / Image banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-video max-h-[460px]">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 tracking-wider">
              {recipe.cuisine}
            </span>
            {recipe.diet && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 tracking-wider">
                {recipe.diet}
              </span>
            )}
            {recipe.fitnessArchetype && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 tracking-wider">
                {recipe.fitnessArchetype}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div 
              className={`w-6 h-6 border-2 flex items-center justify-center p-[3px] rounded-md shrink-0 bg-white/90 dark:bg-gray-800/90 shadow-sm ${
                recipe.isVeg ? "border-emerald-600" : "border-red-600"
              }`}
              title={recipe.isVeg ? "Vegetarian" : "Non-Vegetarian"}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${recipe.isVeg ? "bg-emerald-600" : "bg-red-600"}`} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              {recipe.title}
            </h1>
          </div>
          <p className="text-gray-200/90 text-sm md:text-base max-w-2xl line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Highlights bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-2xl">
            <ClockIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Cooking Time</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {recipe.prepTime + recipe.cookTime} mins
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-2xl">
            <UserGroupIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Servings</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {recipe.servings} people
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <StarIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Rating</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {recipe.rating} / 5.0
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 rounded-2xl">
            <span className="text-sm font-extrabold">⚡</span>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Calories</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {recipe.nutrition?.calories || 350} kcal
            </div>
          </div>
        </div>
      </div>

      {/* Main content Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-4">
              Ingredients
            </h3>
            <ul className="space-y-3.5">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  onClick={() => toggleIngredient(index)}
                  className="flex items-center space-x-3 cursor-pointer select-none group"
                >
                  <span
                    className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                      checkedIngredients[index]
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-gray-300 dark:border-gray-600 group-hover:border-purple-400"
                    }`}
                  >
                    {checkedIngredients[index] && <CheckIcon className="h-3 w-3" />}
                  </span>
                  <span
                    className={`text-sm ${
                      checkedIngredients[index]
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {ingredient}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Cooking Assistant Timer */}
          <div className="bg-gradient-to-tr from-gray-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="font-bold text-lg text-amber-300">Kitchen Timer</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Track baking or cooking stages directly here. We will ring an alarm when time ends.
            </p>

            <div className="text-center py-4">
              <span className="font-mono text-4xl tracking-widest font-black text-white">
                {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
              </span>
            </div>

            <div className="flex justify-center space-x-3">
              {timerRunning ? (
                <button
                  onClick={pauseTimer}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-sm cursor-pointer transition-colors text-black"
                >
                  <PauseIcon className="h-4 w-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={startTimer}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-sm cursor-pointer transition-colors text-white"
                >
                  <PlayIcon className="h-4 w-4" />
                  <span>Start</span>
                </button>
              )}

              <button
                onClick={resetTimer}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 font-bold text-sm cursor-pointer transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Steps Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="font-extrabold text-xl text-gray-900 dark:text-white">
                Step-by-Step Instructions
              </h3>
              <span className="text-xs font-semibold text-gray-400">
                Tap step to highlight & listen
              </span>
            </div>

            <div className="space-y-4">
              {recipe.instructions.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <div
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-500 shadow-sm scale-[1.01]"
                        : "bg-transparent border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-2">
                      <div className="flex items-start space-x-3.5">
                        <span
                          className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isActive
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <p
                          className={`text-sm md:text-base leading-relaxed ${
                            isActive
                              ? "text-gray-950 dark:text-white font-medium"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {step}
                        </p>
                      </div>

                      {/* Text-to-speech speaker button */}
                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakStep(step);
                          }}
                          className="p-1.5 rounded-lg bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm hover:scale-105 border border-purple-100 dark:border-purple-900 cursor-pointer shrink-0"
                          title="Speak instruction"
                        >
                          <SpeakerWaveIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
