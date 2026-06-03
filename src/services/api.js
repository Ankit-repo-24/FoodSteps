// API Service using TheMealDB (100% Free, NO API key required) with automatic fallbacks & filters
import axios from "axios";

// Helper function to assign a fitness archetype based on recipe properties
const getFitnessArchetype = (title = "", diet = "", ingredients = []) => {
  const t = title.toLowerCase();
  const d = diet.toLowerCase();
  const ingString = (ingredients || []).join(" ").toLowerCase();

  if (
    t.includes("chicken") || t.includes("pork") || t.includes("shrimp") || 
    t.includes("tuna") || d.includes("high-protein") || t.includes("salmon") || 
    t.includes("turkey") || t.includes("mutton") || t.includes("biryani") ||
    ingString.includes("chicken") || ingString.includes("tuna") ||
    ingString.includes("turkey") || ingString.includes("mutton") || ingString.includes("lamb")
  ) {
    return "💪 Gym Lovers (High Protein)";
  }
  if (
    t.includes("salad") || t.includes("bowl") || t.includes("quinoa") || 
    t.includes("avocado") || d.includes("vegan") || d.includes("vegetarian") ||
    t.includes("dal") || t.includes("chana") || t.includes("lentil") || t.includes("pulse") ||
    ingString.includes("quinoa") || ingString.includes("spinach") || ingString.includes("avocado") ||
    ingString.includes("lentil") || ingString.includes("chickpea") || ingString.includes("dhal")
  ) {
    return "🏃 Athlete Fuel (Clean & Lean)";
  }
  if (
    t.includes("cake") || t.includes("sweet") || t.includes("chocolate") || 
    t.includes("dessert") || d.includes("dessert") || t.includes("cookie") || 
    t.includes("lava") || t.includes("pie") || t.includes("pudding")
  ) {
    return "🍕 Cheat Meal (High Energy)";
  }
  if (
    t.includes("pizza") || t.includes("pasta") || t.includes("spaghetti") || 
    t.includes("noodles") || t.includes("ramen") || t.includes("macaroni") ||
    ingString.includes("pasta") || ingString.includes("noodle") || ingString.includes("dough")
  ) {
    return "🏋️ Energy & Carb Loading";
  }
  return "🥑 Balanced Nutrition";
};

// Heuristic to decide if a recipe is Vegetarian or Non-Vegetarian
const isVegCategory = (title = "", category = "") => {
  const t = title.toLowerCase();
  const cat = category.toLowerCase();
  
  if (
    t.includes("chicken") || t.includes("beef") || t.includes("pork") || 
    t.includes("mutton") || t.includes("fish") || t.includes("shrimp") || 
    t.includes("lamb") || t.includes("duck") || t.includes("turkey") || 
    t.includes("prawn") || t.includes("seafood") || t.includes("meat") ||
    cat.includes("chicken") || cat.includes("seafood") || cat.includes("pork") ||
    cat.includes("beef") || cat.includes("lamb")
  ) {
    return false; // Non-Vegetarian
  }
  
  // Default to Vegetarian for typical green foods, salads, pulses, desserts
  return true;
};

// Default local recipes (Wiped beef, added mutton/chicken biryanis & pulse recipes)
const DEFAULT_RECIPES = [
  {
    id: 1,
    title: "Creamy Tuscan Garlic Chicken",
    description: "Tender chicken breasts seared and smothered in a rich, creamy garlic sauce with sun-dried tomatoes and fresh spinach. Perfect with pasta or crusty bread.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Italian",
    diet: "High-Protein",
    fitnessArchetype: "💪 Gym Lovers (High Protein)",
    isVeg: false,
    rating: 4.8,
    reviews: 124,
    ingredients: [
      "2 large chicken breasts, halved horizontally",
      "1 tbsp olive oil",
      "1 cup heavy cream",
      "1/2 cup chicken broth",
      "1 tsp garlic powder",
      "1 cup fresh spinach, chopped",
      "1/2 cup sun-dried tomatoes, drained and chopped",
      "1/2 cup grated parmesan cheese",
      "3 cloves garlic, minced"
    ],
    instructions: [
      "Season chicken breasts with salt, pepper, and garlic powder.",
      "Heat olive oil in a large skillet over medium-high heat and sear chicken for 5 minutes on each side until golden brown and cooked through. Remove chicken and set aside.",
      "In the same skillet, add minced garlic and cook for 1 minute until fragrant.",
      "Add chicken broth, heavy cream, and parmesan cheese. Bring to a simmer, stirring constantly, for about 3-5 minutes until sauce thickens slightly.",
      "Stir in sun-dried tomatoes and spinach. Let spinach wilt for 2 minutes.",
      "Return chicken to the skillet, spoon sauce over it, and cook for another 2-3 minutes until heated through. Serve hot!"
    ],
    nutrition: {
      calories: 450,
      protein: "32g",
      carbs: "8g",
      fat: "30g"
    }
  },
  {
    id: 7,
    title: "Hyderabadi Chicken Biryani",
    description: "An authentic Indian classic featuring layers of long-grain basmati rice, tender marinated chicken, saffron, fresh mint, and caramelized onions, slow-cooked to perfection (Dum cooking).",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800",
    prepTime: 25,
    cookTime: 40,
    servings: 4,
    difficulty: "Hard",
    cuisine: "Indian",
    diet: "High-Protein",
    fitnessArchetype: "💪 Gym Lovers (High Protein)",
    isVeg: false,
    rating: 5.0,
    reviews: 312,
    ingredients: [
      "500g bone-in chicken pieces",
      "2 cups premium Basmati rice",
      "1 cup plain yogurt (curd)",
      "1 cup fried onions (biryani onions)",
      "1/4 cup fresh mint leaves, chopped",
      "1/4 cup fresh coriander leaves, chopped",
      "1 tbsp ginger-garlic paste",
      "1 tsp garam masala",
      "1/2 tsp saffron threads dissolved in 2 tbsp warm milk",
      "3 tbsp ghee (clarified butter)",
      "Whole spices (cardamom, cloves, cinnamon, bay leaf)"
    ],
    instructions: [
      "Wash Basmati rice and soak in water for 30 minutes.",
      "Marinate chicken in yogurt, ginger-garlic paste, garam masala, salt, red chili powder, half of the fried onions, mint, and coriander for at least 1 hour.",
      "Boil water in a large pot with whole spices and salt. Add soaked rice and cook until it is 70% done. Drain the rice.",
      "In a heavy-bottomed pot, spread the marinated chicken at the bottom.",
      "Layer the cooked rice on top of the chicken. Sprinkle remaining fried onions, mint, coriander, and drizzle saffron milk and melted ghee.",
      "Seal the pot with dough or foil and cover tightly. Cook on low heat (Dum) for 35-40 minutes until chicken is tender and rice is fluffy. Mix gently and serve with Raita."
    ],
    nutrition: {
      calories: 550,
      protein: "28g",
      carbs: "65g",
      fat: "18g"
    }
  },
  {
    id: 8,
    title: "Kashmiri Mutton Biryani",
    description: "Rich and aromatic biryani made with slow-cooked succulent mutton chunks, whole spices, saffron-infused rice, and garnished with almonds and cashews.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800",
    prepTime: 30,
    cookTime: 60,
    servings: 3,
    difficulty: "Hard",
    cuisine: "Indian",
    diet: "High-Protein",
    fitnessArchetype: "💪 Gym Lovers (High Protein)",
    isVeg: false,
    rating: 4.9,
    reviews: 184,
    ingredients: [
      "500g mutton, cut into chunks",
      "2 cups Basmati rice",
      "1 cup fried onions",
      "1 tbsp ginger paste",
      "1 tbsp garlic paste",
      "1/2 cup yogurt",
      "1 tsp fennel powder",
      "1 tsp dry ginger powder",
      "2 tbsp milk with saffron threads",
      "1/4 cup roasted almonds and cashews",
      "4 tbsp ghee",
      "Rose water (a few drops)"
    ],
    instructions: [
      "Clean mutton and marinate with yogurt, ginger paste, garlic paste, fennel powder, ginger powder, and salt for 2 hours.",
      "Cook the marinated mutton in a pressure cooker or pot with ghee until tender. Set aside.",
      "Parboil Basmati rice in salted water with cardamom and cloves until 70% cooked, then drain.",
      "In a deep pot, layer the mutton gravy at the bottom, followed by parboiled rice, fried onions, roasted nuts, saffron milk, and rose water.",
      "Seal the lid and cook on low dum heat for 20-25 minutes. Serve hot!"
    ],
    nutrition: {
      calories: 620,
      protein: "35g",
      carbs: "62g",
      fat: "24g"
    }
  },
  {
    id: 9,
    title: "Classic Yellow Dal Tadka",
    description: "A staple Indian pulse recipe featuring cooked yellow split lentils tempered with cumin seeds, garlic, dry red chilies, and aromatic ghee.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.8,
    reviews: 245,
    ingredients: [
      "1 cup Toor dal (split pigeon peas) or Moong dal",
      "3 cups water",
      "1/2 tsp turmeric powder",
      "1 small onion, finely chopped",
      "1 medium tomato, chopped",
      "2 cloves garlic, minced",
      "1 tsp cumin seeds",
      "2 dry red chilies",
      "1/2 tsp garam masala",
      "2 tbsp ghee or oil",
      "Fresh coriander leaves for garnish"
    ],
    instructions: [
      "Wash and rinse dal thoroughly. Boil in a pressure cooker or pot with water, turmeric, and salt until soft and mushy.",
      "Heat ghee or oil in a pan. Add cumin seeds and let them splutter.",
      "Add minced garlic and dry red chilies. Sauté for 1 minute.",
      "Add chopped onions and fry until translucent. Add chopped tomatoes and cook until soft.",
      "Pour the cooked dal into the pan. Stir well and bring to a simmer. Add garam masala.",
      "Garnish with chopped coriander leaves and serve hot with steamed rice or roti."
    ],
    nutrition: {
      calories: 220,
      protein: "12g",
      carbs: "30g",
      fat: "6g"
    }
  },
  {
    id: 10,
    title: "Spicy Amritsari Chana Masala",
    description: "Tangy and flavorful chickpea pulse curry cooked in onion-tomato gravy with dry mango powder (amchur) and traditional chana spices.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "Spicy",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.7,
    reviews: 167,
    ingredients: [
      "1.5 cups dry chickpeas (soaked overnight)",
      "1 bag black tea (to cook chickpeas, optional for dark color)",
      "2 medium onions, pureed",
      "3 medium tomatoes, pureed",
      "1 tbsp ginger-garlic paste",
      "2 tsp chana masala powder",
      "1/2 tsp amchur (dry mango powder)",
      "1 tsp cumin seeds",
      "2 tbsp oil",
      "Fresh ginger juliennes and green chilies for garnish"
    ],
    instructions: [
      "Drain soaked chickpeas. Boil them with a tea bag, salt, and water in a pressure cooker until soft. Discard the tea bag.",
      "Heat oil in a pan, add cumin seeds, and let them brown.",
      "Add onion puree and ginger-garlic paste. Sauté until golden-brown and oil separates.",
      "Add tomato puree, red chili powder, turmeric, and cook for 5 minutes.",
      "Stir in chana masala powder and boiled chickpeas with their cooking water. Simmer on medium-low for 15 minutes to let the gravy thicken.",
      "Stir in amchur powder. Garnish with ginger juliennes and green chilies. Serve with Bhaturas or rice."
    ],
    nutrition: {
      calories: 280,
      protein: "14g",
      carbs: "45g",
      fat: "8g"
    }
  },
  {
    id: 3,
    title: "Classic Margherita Pizza",
    description: "Simple yet sublime, this authentic Italian pizza features a crispy crust, aromatic tomato sauce, fresh mozzarella, and aromatic sweet basil.",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800",
    prepTime: 20,
    cookTime: 10,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Italian",
    diet: "Vegetarian",
    fitnessArchetype: "🏋️ Energy & Carb Loading",
    isVeg: true,
    rating: 4.7,
    reviews: 215,
    ingredients: [
      "1 pre-made pizza dough ball (at room temperature)",
      "1/2 cup canned San Marzano crushed tomatoes",
      "120g fresh mozzarella cheese, sliced or torn",
      "Fresh basil leaves",
      "1 tbsp extra virgin olive oil",
      "Pinch of sea salt"
    ],
    instructions: [
      "Preheat oven (with a pizza stone if you have one) to its highest setting (usually 250°C/500°F).",
      "Roll or stretch the pizza dough out onto a piece of parchment paper to form a 12-inch circle.",
      "Spread crushed tomatoes evenly over the dough, leaving a 1/2-inch border around the edge.",
      "Distribute the fresh mozzarella cheese slices evenly over the tomato sauce.",
      "Drizzle with extra virgin olive oil and sprinkle with sea salt.",
      "Bake for 8-10 minutes until the crust is golden-brown and the cheese is bubbly and slightly charred.",
      "Remove from oven, top with fresh basil leaves, slice and serve immediately."
    ],
    nutrition: {
      calories: 290,
      protein: "12g",
      carbs: "38g",
      fat: "10g"
    }
  },
  {
    id: 4,
    title: "Rich Tonkotsu Pork Ramen",
    description: "A comforting bowl of deeply flavored, creamy pork bone broth filled with fresh wheat noodles, tender chashu pork, marinated soft egg, and traditional toppings.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800",
    prepTime: 30,
    cookTime: 240,
    servings: 2,
    difficulty: "Hard",
    cuisine: "Japanese",
    diet: "High-Protein",
    fitnessArchetype: "💪 Gym Lovers (High Protein)",
    isVeg: false,
    rating: 5.0,
    reviews: 54,
    ingredients: [
      "2 portions fresh ramen noodles",
      "4 cups high-quality pork/chicken broth (or homemade Tonkotsu broth)",
      "4 slices chashu pork belly",
      "1 ramen egg (soft boiled, marinated in soy sauce)",
      "1/4 cup green onions, finely sliced",
      "1 sheet nori seaweed, cut in squares",
      "1/2 cup bamboo shoots (menma)",
      "1 tbsp black garlic oil (mayu)"
    ],
    instructions: [
      "Warm the broth in a pot over medium heat. Season to taste with dashi powder and soy sauce.",
      "In a separate pan, sear the chashu pork belly slices until hot and slightly caramelized on both sides.",
      "Boil ramen noodles according to package instructions (usually 2-3 minutes). Drain thoroughly.",
      "Divide the hot broth between two deep ramen bowls.",
      "Add the drained noodles to the broth, folding them neatly.",
      "Top with sliced chashu, half of a soft-boiled marinated egg, bamboo shoots, green onions, and a square of nori.",
      "Drizzle with black garlic oil and serve piping hot."
    ],
    nutrition: {
      calories: 650,
      protein: "35g",
      carbs: "58g",
      fat: "28g"
    }
  },
  {
    id: 5,
    title: "Vegan Quinoa Buddha Bowl",
    description: "A vibrant, nutrient-dense bowl packed with colorful vegetables, fluffy quinoa, crispy chickpeas, and creamy homemade peanut ginger dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: "Easy",
    cuisine: "American",
    diet: "Vegan",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.6,
    reviews: 98,
    ingredients: [
      "1 cup cooked quinoa",
      "1 cup canned chickpeas, drained and rinsed",
      "1/2 tbsp olive oil",
      "1 tsp smoked paprika",
      "1 cup shredded purple cabbage",
      "1 cup fresh spinach leaves",
      "1/2 avocado, sliced",
      "1/2 cup shredded carrots",
      "2 tbsp peanut butter",
      "1 tbsp soy sauce",
      "1 tbsp maple syrup",
      "1 tbsp lime juice",
      "1 tsp minced ginger"
    ],
    instructions: [
      "Preheat oven to 200°C (400°F). Toss chickpeas with olive oil, paprika, salt, and pepper. Roast for 15 minutes until crispy.",
      "Prepare dressing: Whisk peanut butter, soy sauce, maple syrup, lime juice, ginger, and 1-2 tbsp warm water together until smooth.",
      "Assemble bowls: Divide quinoa, roasted chickpeas, purple cabbage, spinach, carrots, and avocado between two bowls.",
      "Drizzle dressing generously over the top and garnish with sesame seeds or green onions."
    ],
    nutrition: {
      calories: 420,
      protein: "14g",
      carbs: "48g",
      fat: "18g"
    }
  },
  {
    id: 6,
    title: "Molten Chocolate Lava Cake",
    description: "Decadent, rich chocolate cake with a warm, gooey, liquid chocolate center. Indulgence at its finest, served with a scoop of vanilla ice cream.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800",
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    difficulty: "Hard",
    cuisine: "French",
    diet: "Dessert",
    fitnessArchetype: "🍕 Cheat Meal (High Energy)",
    isVeg: true,
    rating: 4.9,
    reviews: 142,
    ingredients: [
      "100g high-quality dark chocolate (60-70% cocoa)",
      "50g unsalted butter",
      "1 whole egg + 1 egg yolk",
      "2 tbsp sugar",
      "1 tbsp all-purpose flour",
      "Cocoa powder for dusting",
      "Pinch of salt"
    ],
    instructions: [
      "Preheat oven to 200°C (400°F). Butter two small ramekins and dust inside with cocoa powder, tapping out the excess.",
      "Melt dark chocolate and butter together in a heatproof bowl set over a pot of simmering water (double boiler) or in short bursts in the microwave. Stir until completely smooth.",
      "In a medium bowl, whisk the whole egg, egg yolk, sugar, and pinch of salt until pale and slightly thickened.",
      "Gently fold the melted chocolate mixture and flour into the eggs until combined. Do not overmix.",
      "Divide the batter evenly between the prepared ramekins.",
      "Bake for 11-13 minutes. The edges should be firm, but the center should still be soft and jiggly.",
      "Let cool for 1 minute, then place a plate over the ramekin and invert it. Gently lift the ramekin, dust with powdered sugar, and serve with vanilla ice cream immediately."
    ],
    nutrition: {
      calories: 390,
      protein: "6g",
      carbs: "30g",
      fat: "26g"
    }
  },
  // --- BEVERAGES & COLD DRINKS ---
  {
    id: 11,
    title: "Classic Mango Lassi",
    description: "A creamy, smooth Indian summer beverage made from fresh ripe sweet mangoes, yogurt, a pinch of green cardamom, and garnished with pistachios.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800",
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🍕 Cheat Meal (High Energy)",
    isVeg: true,
    rating: 4.9,
    reviews: 428,
    ingredients: [
      "1 cup ripe mango pulp (fresh or canned Alphonso)",
      "1 cup fresh thick plain yogurt",
      "1/2 cup cold milk or water (to adjust consistency)",
      "2 tbsp sugar or maple syrup",
      "1/4 tsp green cardamom powder",
      "4-5 ice cubes",
      "1 tsp chopped pistachios and saffron strands for garnish"
    ],
    instructions: [
      "Add mango pulp, cold yogurt, milk (or water), sugar, and green cardamom powder into a blender.",
      "Add ice cubes and blend on high speed for 1-2 minutes until thick, smooth, and frothy.",
      "Taste and add more sugar if needed. Adjust consistency with a little more milk if it is too thick.",
      "Pour into tall serving glasses.",
      "Garnish with chopped pistachios, almond slivers, and a few saffron strands. Serve chilled immediately."
    ],
    nutrition: {
      calories: 210,
      protein: "6g",
      carbs: "38g",
      fat: "4g"
    }
  },
  {
    id: 12,
    title: "Masala Chai",
    description: "The soul of Indian beverage culture. Black tea leaves simmered with milk, fresh crushed ginger, and a fragrant spice blend of cardamom, cloves, and cinnamon.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🥑 Balanced Nutrition",
    isVeg: true,
    rating: 4.9,
    reviews: 512,
    ingredients: [
      "1.5 cups water",
      "1/2 cup milk",
      "2 tsp premium black tea leaves (Assam or Darjeeling blend)",
      "1 inch fresh ginger, crushed",
      "3 green cardamom pods, lightly crushed",
      "2 cloves",
      "1 small cinnamon stick",
      "2 tsp sugar (adjust to taste)"
    ],
    instructions: [
      "In a saucepan, bring the water to a boil over medium heat.",
      "Add the crushed ginger, crushed cardamom pods, cloves, and cinnamon stick. Simmer for 2-3 minutes until spices release their aromas and color the water slightly.",
      "Add the black tea leaves and simmer for 1-2 minutes until the tea begins to color deeply.",
      "Pour in the milk and sugar. Bring the mixture to a rolling boil.",
      "Once boiling, reduce the heat to low and let it simmer for another 2 minutes, allowing the flavors to meld. Watch closely to prevent boiling over.",
      "Turn off the heat. Strain the chai through a tea strainer directly into clay cups (kulhad) or mugs. Serve hot with biscuits or samosas."
    ],
    nutrition: {
      calories: 75,
      protein: "2.5g",
      carbs: "12g",
      fat: "2g"
    }
  },
  {
    id: 13,
    title: "Delhi Shikanji (Nimbu Pani)",
    description: "A traditional Indian spiced cold lemonade loaded with roasted cumin, black salt, fresh mint, and lime juice. Incredibly refreshing and restorative.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.8,
    reviews: 195,
    ingredients: [
      "2 large juicy lemons, squeezed",
      "2.5 cups chilled water",
      "3 tbsp sugar",
      "1/2 tsp black salt (kala namak)",
      "1/2 tsp roasted cumin powder",
      "1/4 tsp black pepper powder",
      "10-12 fresh mint leaves, torn",
      "Ice cubes"
    ],
    instructions: [
      "In a large pitcher, combine chilled water and sugar. Stir vigorously until the sugar is completely dissolved.",
      "Add the fresh lemon juice, black salt, roasted cumin powder, and black pepper powder to the pitcher. Stir well.",
      "Gently clap the mint leaves between your hands to release their oils and throw them into the pitcher.",
      "Fill two glasses with ice cubes.",
      "Pour the spiced lemonade over the ice, stir, and garnish with a lemon slice. Enjoy immediately to beat the heat!"
    ],
    nutrition: {
      calories: 65,
      protein: "0.2g",
      carbs: "16g",
      fat: "0g"
    }
  },
  {
    id: 14,
    title: "Aromatic Jaljeera",
    description: "A refreshing and tangy Indian cold drink made from cumin, mint, coriander, and dry mango powder. Renowned for its digestive benefits and refreshing flavor.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
    prepTime: 10,
    cookTime: 0,
    servings: 3,
    difficulty: "Easy",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.7,
    reviews: 88,
    ingredients: [
      "1/2 cup fresh mint leaves",
      "1/4 cup fresh coriander leaves",
      "1 tbsp cumin seeds, roasted and ground",
      "1 tsp dry mango powder (amchur)",
      "1/2 tsp black salt (kala namak)",
      "1 tbsp seedless tamarind paste",
      "3 cups ice-cold water",
      "1 tbsp sugar",
      "2 tbsp salty chickpea pearls (boondi) for garnish"
    ],
    instructions: [
      "In a blender, grind the mint leaves, coriander leaves, tamarind paste, sugar, and 2-3 tablespoons of water into a very smooth, fine green paste.",
      "Transfer this paste to a large bowl or jug.",
      "Add the roasted cumin powder, dry mango powder, black salt, and ice-cold water. Whisk together until fully combined.",
      "Filter the jaljeera through a sieve if you prefer a clear beverage, though keeping the fine herbs adds flavor.",
      "Serve chilled, garnished with a handful of crispy boondi on top of each glass."
    ],
    nutrition: {
      calories: 45,
      protein: "0.5g",
      carbs: "10g",
      fat: "0.1g"
    }
  },
  // --- SNACKS & STARTERS ---
  {
    id: 15,
    title: "Punjabi Samosa",
    description: "Golden, crispy, and flaky pastry cones stuffed with a spiced potato and green pea filling. A quintessential Indian street snack served with green and sweet chutneys.",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=800",
    prepTime: 25,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🍕 Cheat Meal (High Energy)",
    isVeg: true,
    rating: 4.9,
    reviews: 732,
    ingredients: [
      "2 cups all-purpose flour (maida)",
      "4 tbsp ghee or oil (for the dough)",
      "1/2 tsp carom seeds (ajwain)",
      "3 large potatoes, boiled and cubed",
      "1/2 cup green peas, boiled",
      "1 tsp ginger, chopped",
      "2 green chilies, minced",
      "1 tsp coriander seeds, crushed",
      "1 tsp garam masala",
      "1/2 tsp dry mango powder (amchur)",
      "Oil for deep frying",
      "Salt to taste"
    ],
    instructions: [
      "Prepare pastry dough: Mix flour, carom seeds, salt, and melted ghee in a bowl. Rub ghee into flour until it resembles breadcrumbs. Add cold water in small portions and knead into a very firm dough. Cover and rest for 30 minutes.",
      "Make filling: Heat 1 tbsp oil in a pan. Add crushed coriander seeds, chopped ginger, and green chilies. Sauté for 1 minute.",
      "Add the boiled peas and cubed potatoes. Stir in garam masala, dry mango powder, red chili powder, and salt. Mash the potatoes slightly while mixing. Cook on low heat for 5 minutes, then let the filling cool down completely.",
      "Shape samosas: Divide the rested dough into 4-5 equal balls. Roll each ball into an oval sheet about 1/16 inch thick. Cut the oval horizontally into two halves.",
      "Fold one half into a cone shape, overlapping the flat edge and sealing it with a little water. Stuff the cone with 2 tablespoons of potato filling.",
      "Apply water to the circular edge, make a small pleat on the back side, and pinch the edges together to seal the samosa tightly. It should stand upright.",
      "Deep fry: Heat oil in a deep pan. The oil should be warm, not hot. Fry samosas on low heat for 15-20 minutes, turning occasionally, until they turn golden-brown and super crispy. Serve hot with tamarind and mint chutney."
    ],
    nutrition: {
      calories: 320,
      protein: "5g",
      carbs: "42g",
      fat: "14g"
    }
  },
  {
    id: 16,
    title: "Crispy Vegetable Pakora",
    description: "Delicious and crunchy spiced fritters made with onions, potatoes, spinach, and cauliflower dipped in a seasoned chickpea flour batter and fried to perfection.",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🍕 Cheat Meal (High Energy)",
    isVeg: true,
    rating: 4.8,
    reviews: 320,
    ingredients: [
      "1 large onion, thinly sliced",
      "1 medium potato, cut into juliennes",
      "1/2 cup fresh spinach leaves, chopped",
      "1.5 cups chickpea flour (besan)",
      "2 tbsp rice flour (for extra crispness)",
      "2 green chilies, finely chopped",
      "1/2 tsp carom seeds (ajwain)",
      "1/2 tsp turmeric powder",
      "1/2 tsp red chili powder",
      "1/2 cup water",
      "Oil for deep frying",
      "Chaot masala for dusting"
    ],
    instructions: [
      "In a large mixing bowl, combine the sliced onions, potatoes, spinach, and green chilies.",
      "Add chickpea flour, rice flour, carom seeds, red chili powder, turmeric, and salt. Toss the vegetables dry so they are coated in the flour mixture.",
      "Sprinkle water in small amounts, mixing gently with your hand. The vegetables should release some moisture. The batter should be thick and coat the vegetables tightly, not runny.",
      "Heat oil in a deep frying pan over medium heat. To test, drop a tiny piece of batter; it should sizzle and rise immediately.",
      "Drop small, irregular clumps of the vegetable mix into the hot oil. Do not overcrowd the pan.",
      "Fry the pakoras for 5-6 minutes, turning occasionally, until golden-brown and crunchy. Drain on paper towels.",
      "Dust with chaat masala and serve piping hot with coriander chutney and masala chai."
    ],
    nutrition: {
      calories: 240,
      protein: "8g",
      carbs: "28g",
      fat: "11g"
    }
  },
  {
    id: 17,
    title: "Aromatic Paneer Tikka",
    description: "A popular tandoori snack featuring cubes of paneer, bell peppers, and onions marinated in a spiced yogurt blend and grilled to smoky perfection.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800",
    prepTime: 20,
    cookTime: 15,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "High-Protein",
    fitnessArchetype: "💪 Gym Lovers (High Protein)",
    isVeg: true,
    rating: 4.8,
    reviews: 284,
    ingredients: [
      "250g paneer, cut into thick cubes",
      "1 red bell pepper, cut into squares",
      "1 green bell pepper, cut into squares",
      "1 large onion, layers separated and cut into squares",
      "1/2 cup thick hung curd (greek yogurt)",
      "1 tbsp ginger-garlic paste",
      "1 tbsp mustard oil (crucial for authentic flavor)",
      "1 tsp Kashmiri red chili powder",
      "1 tsp kasuri methi (dried fenugreek leaves)",
      "1 tsp garam masala",
      "1 tsp lemon juice"
    ],
    instructions: [
      "In a bowl, prepare the marinade: Whisk hung curd with ginger-garlic paste, mustard oil, red chili powder, garam masala, kasuri methi, salt, and lemon juice until smooth.",
      "Gently add the paneer cubes, bell peppers, and onions. Coat them thoroughly with the marinade, being careful not to break the paneer. Cover and marinate in the fridge for 1-2 hours.",
      "Preheat your oven or air fryer to 200°C (400°F). If using wooden skewers, soak them in water for 30 minutes first.",
      "Thread the marinated paneer, onions, and bell peppers alternately onto the skewers.",
      "Place skewers on a baking sheet lined with foil. Roast in the preheated oven for 12-15 minutes, then turn on the broiler for 2-3 minutes to get slightly charred edges.",
      "Drizzle with melted butter, sprinkle chaat masala and lemon juice, and serve immediately with mint chutney."
    ],
    nutrition: {
      calories: 310,
      protein: "18g",
      carbs: "10g",
      fat: "22g"
    }
  },
  {
    id: 18,
    title: "Tandoori Chicken Tikka",
    description: "Succulent, boneless chicken pieces marinated in yogurt and intense Indian spices, threaded onto skewers and grilled until juicy and charred.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800",
    prepTime: 20,
    cookTime: 15,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "High-Protein",
    fitnessArchetype: "💪 Gym Lovers (High Protein)",
    isVeg: false,
    rating: 4.9,
    reviews: 416,
    ingredients: [
      "500g boneless chicken breast, cut into chunks",
      "1/2 cup hung curd (thick greek yogurt)",
      "1 tbsp ginger-garlic paste",
      "1.5 tbsp lemon juice",
      "1 tbsp mustard oil",
      "1.5 tsp Kashmiri red chili powder",
      "1 tsp tandoori masala powder",
      "1 tsp garam masala",
      "1 tsp dried fenugreek leaves (kasuri methi)",
      "Melted butter for basting"
    ],
    instructions: [
      "Pat chicken chunks dry. Toss with 1 tbsp lemon juice and salt, and let sit for 15 minutes.",
      "In a separate bowl, prepare the marinade: Mix yogurt, ginger-garlic paste, mustard oil, Kashmiri red chili, tandoori masala, garam masala, and fenugreek leaves.",
      "Add chicken to the marinade and mix well to coat all sides. Cover and refrigerate for at least 2 hours (overnight is best).",
      "Preheat grill or oven to 220°C (425°F).",
      "Thread chicken pieces onto metal or soaked wooden skewers, leaving small gaps between them.",
      "Grill or bake for 12-15 minutes, turning once. Baste chicken with melted butter halfway through.",
      "Broil for the last 2 minutes until you get dark charred spots. Garnish with onion rings and lemon wedges. Serve hot."
    ],
    nutrition: {
      calories: 290,
      protein: "34g",
      carbs: "4g",
      fat: "14g"
    }
  },
  {
    id: 19,
    title: "Hara Bhara Kabab",
    description: "Healthy and delicious spiced patties made with spinach, green peas, potatoes, paneer, and aromatic spices, shallow fried with a cashew nut garnish.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.7,
    reviews: 112,
    ingredients: [
      "2 cups fresh spinach leaves (palak)",
      "1 cup green peas, boiled",
      "2 medium potatoes, boiled and mashed",
      "50g paneer, grated",
      "2 green chilies, finely chopped",
      "1/2 cup breadcrumbs (for binding)",
      "1 tsp ginger-garlic paste",
      "1 tsp chaat masala",
      "12-15 whole cashew nuts, split",
      "3 tbsp oil for shallow frying"
    ],
    instructions: [
      "Blanch spinach: Boil water, cook spinach for 2 minutes, then transfer to ice-cold water. Squeeze out all excess water from the spinach very thoroughly to keep the dough dry.",
      "In a food processor, blend the dry blanched spinach and boiled green peas into a coarse paste without adding any water.",
      "In a bowl, combine the spinach-pea paste, mashed potatoes, grated paneer, green chilies, ginger-garlic paste, chaat masala, salt, and breadcrumbs. Knead into a soft, non-sticky dough. Add more breadcrumbs if it feels wet.",
      "Divide dough into small portions and roll them into round patties.",
      "Press a split cashew nut in the center of each patty.",
      "Heat oil in a non-stick pan over medium heat. Shallow fry the kababs for 3-4 minutes on each side until they turn crispy and brown on the outside. Serve hot with mint chutney."
    ],
    nutrition: {
      calories: 180,
      protein: "6g",
      carbs: "22g",
      fat: "8g"
    }
  },
  // --- BREAKFAST ---
  {
    id: 20,
    title: "South Indian Masala Dosa",
    description: "A fermented rice and lentil crepe cooked until thin and crispy, folded around a savory, spiced potato onion curry. Accompanied by coconut chutney and hot sambar.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800",
    prepTime: 20,
    cookTime: 20,
    servings: 3,
    difficulty: "Hard",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🏋️ Energy & Carb Loading",
    isVeg: true,
    rating: 4.9,
    reviews: 624,
    ingredients: [
      "3 cups readymade fermented Dosa batter",
      "3 large potatoes, boiled and mashed coarsely",
      "1 large onion, sliced",
      "2 green chilies, chopped",
      "1 tsp mustard seeds",
      "1 tsp split white lentils (urad dal)",
      "10 curry leaves",
      "1/2 tsp turmeric powder",
      "Ghee or oil for roasting",
      "Fresh coriander for garnish"
    ],
    instructions: [
      "Make potato masala: Heat 1 tbsp oil in a pan. Add mustard seeds and let them splutter. Add urad dal and curry leaves, and sauté until the dal turns golden.",
      "Add green chilies and sliced onions. Cook until onions are soft and translucent.",
      "Add turmeric powder, salt, and 3 tbsp water. Stir in the mashed potatoes and mix well. Simmer for 3 minutes, then stir in fresh coriander and set aside.",
      "Prepare Dosa: Heat a non-stick griddle (tawa) on medium. Sprinkle a few drops of water to cool it slightly, then wipe clean with a damp cloth.",
      "Pour a ladleful of dosa batter in the center. Using the back of the ladle, spread the batter in a circular motion outwards to form a thin, large crepe.",
      "Drizzle 1 tsp ghee or oil around the edges and center of the dosa. Cook on medium-high until the bottom turns golden-brown and crispy, and the edges lift.",
      "Place 3 tablespoons of potato masala in the center. Fold the dosa into a cylinder or triangle. Serve immediately with coconut chutney and piping hot sambar."
    ],
    nutrition: {
      calories: 340,
      protein: "6g",
      carbs: "54g",
      fat: "11g"
    }
  },
  {
    id: 21,
    title: "Light & Healthy Aloo Poha",
    description: "A popular quick Indian breakfast of flattened rice flakes tempered with mustard seeds, turmeric, green chilies, soft potatoes, and crunchy roasted peanuts.",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=800",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🥑 Balanced Nutrition",
    isVeg: true,
    rating: 4.8,
    reviews: 210,
    ingredients: [
      "2 cups flattened rice (thick poha)",
      "1 medium potato, cut into small cubes",
      "1 small onion, finely chopped",
      "2 tbsp raw peanuts",
      "1 tsp mustard seeds",
      "1/2 tsp turmeric powder",
      "2 green chilies, chopped",
      "8-10 curry leaves",
      "1 tbsp lemon juice",
      "2 tbsp chopped fresh coriander",
      "1 tbsp oil"
    ],
    instructions: [
      "Rinse poha: Place poha in a colander and rinse gently under cold water twice. Drain thoroughly and leave it to soften. Toss with a pinch of salt and sugar, and set aside.",
      "Heat oil in a pan. Add peanuts and fry until they are golden-brown and crunchy. Remove them and set aside.",
      "In the same oil, add mustard seeds and let them crackle. Add curry leaves, chopped green chilies, and chopped onions. Sauté until onions are translucent.",
      "Add cubed potatoes, turmeric powder, and salt. Mix, cover, and cook on low heat for 5-6 minutes until the potatoes are tender.",
      "Stir in the softened poha and roasted peanuts. Toss gently to combine without mashing the rice flakes.",
      "Cover and steam on low heat for 2 minutes.",
      "Turn off the heat. Drizzle lemon juice and garnish with fresh coriander. Serve hot with a wedge of lemon."
    ],
    nutrition: {
      calories: 260,
      protein: "5g",
      carbs: "45g",
      fat: "7g"
    }
  },
  {
    id: 22,
    title: "Fluffy Idli Sambar",
    description: "Soft, spongy steamed rice cakes served with a rich, tangy lentil and vegetable stew (sambar) cooked with tamarind and traditional spices.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.8,
    reviews: 318,
    ingredients: [
      "3 cups fermented Idli batter (rice & urad dal)",
      "1 cup split pigeon peas (toor dal)",
      "1 cup mixed vegetables (drumsticks, pumpkin, carrot, small onions)",
      "2 tbsp sambar powder",
      "2 tbsp tamarind pulp",
      "1 tsp mustard seeds",
      "1/2 tsp turmeric powder",
      "2 dried red chilies",
      "10 curry leaves",
      "1 tbsp oil"
    ],
    instructions: [
      "Steam idlis: Grease an idli mold tray with oil. Pour spoonfuls of fermented batter into the molds. Steam in an idli cooker or large pot with water for 10-12 minutes until a toothpick inserted comes out clean. Set aside.",
      "Cook dal: Boil toor dal with water, salt, and turmeric in a pressure cooker until soft and mashed.",
      "Make Sambar: In a pot, cook the mixed vegetables in water with a pinch of salt until tender.",
      "Add the mashed dal, tamarind pulp, and sambar powder to the vegetables. Stir well and simmer for 8-10 minutes to allow the flavors to blend.",
      "Prepare tempering: Heat oil in a small pan. Add mustard seeds, dried red chilies, and curry leaves. Once the seeds crackle, pour this tempering immediately into the simmering sambar.",
      "Serve the hot, fluffy steamed idlis submerged in bowls of steaming hot aromatic Sambar with coconut chutney."
    ],
    nutrition: {
      calories: 220,
      protein: "9g",
      carbs: "40g",
      fat: "3g"
    }
  },
  {
    id: 23,
    title: "Chole Bhature",
    description: "A classic North Indian feast. Spiced, tangy chickpea curry (chole) paired with giant puffed-up deep-fried leavened bread (bhatura).",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    prepTime: 20,
    cookTime: 30,
    servings: 3,
    difficulty: "Hard",
    cuisine: "Indian",
    diet: "Spicy",
    fitnessArchetype: "🍕 Cheat Meal (High Energy)",
    isVeg: true,
    rating: 4.9,
    reviews: 510,
    ingredients: [
      "1.5 cups dry chickpeas (soaked overnight)",
      "2 cups all-purpose flour (maida)",
      "1/4 cup plain yogurt (curd)",
      "1/4 tsp baking soda",
      "2 onions, finely chopped",
      "3 tomatoes, pureed",
      "1 tbsp ginger-garlic paste",
      "2 tbsp chole masala spice mix",
      "Oil for deep frying",
      "Sliced onions and pickles for serving"
    ],
    instructions: [
      "Make Bhatura dough: In a bowl, mix flour, yogurt, baking soda, 1 tsp oil, and a pinch of salt. Knead with warm water into a soft, smooth dough. Coat with a little oil, cover with a damp cloth, and rest for 2 hours.",
      "Cook Chole: Boil soaked chickpeas in a pressure cooker with salt and water until soft.",
      "Chole Gravy: Heat 2 tbsp oil in a pan. Add chopped onions and ginger-garlic paste. Sauté until golden-brown.",
      "Add tomato puree and cook for 5 minutes until oil separates. Add chole masala, red chili powder, and boiled chickpeas along with their water. Simmer on medium-low for 15 minutes until gravy is thick.",
      "Fry Bhature: Heat oil in a deep frying pan on high heat. Divide dough into balls. Roll a ball into a large, thin oval shape.",
      "Gently slide it into the hot oil. Press down lightly with a slotted spoon; it should puff up into a large balloon. Flip and fry until golden-brown on both sides. Drain and serve hot with Chole, sliced onions, and green chilies."
    ],
    nutrition: {
      calories: 580,
      protein: "14g",
      carbs: "72g",
      fat: "25g"
    }
  },
  // --- DINNER ---
  {
    id: 24,
    title: "Premium Butter Chicken (Murgh Makhani)",
    description: "An legendary Indian dish consisting of juicy grilled chicken pieces cooked in a rich, velvety, creamy tomato gravy flavored with butter, cashews, and dried fenugreek.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "High-Protein",
    fitnessArchetype: "💪 Gym Lovers (High Protein)",
    isVeg: false,
    rating: 5.0,
    reviews: 840,
    ingredients: [
      "500g chicken thighs, cut into bite-sized pieces",
      "1 cup plain yogurt",
      "2 tbsp ginger-garlic paste",
      "2 cups tomato puree",
      "4 tbsp unsalted butter",
      "1/2 cup heavy cream",
      "1/4 cup cashew paste (cashews soaked and blended)",
      "1 tbsp Kashmiri red chili powder",
      "1 tsp dried fenugreek leaves (kasuri methi)",
      "1 tsp garam masala"
    ],
    instructions: [
      "Marinate chicken in yogurt, 1 tbsp ginger-garlic paste, half of the red chili powder, and salt for at least 1 hour.",
      "Sear chicken in a hot skillet with 1 tbsp oil until lightly charred and cooked through. Set aside.",
      "In a separate pot, melt 2 tbsp butter. Add remaining ginger-garlic paste and sauté for 1 minute.",
      "Add tomato puree, chili powder, and cashew paste. Simmer for 10 minutes until the sauce thickens and releases oil.",
      "Stir in the cooked chicken pieces, heavy cream, and remaining butter. Simmer for another 5 minutes.",
      "Add garam masala and crush the dried fenugreek leaves between your palms into the curry. Stir well and cook for 1 minute. Serve with warm Garlic Naan."
    ],
    nutrition: {
      calories: 490,
      protein: "28g",
      carbs: "12g",
      fat: "36g"
    }
  },
  {
    id: 25,
    title: "Paneer Butter Masala",
    description: "A vegetarian masterpiece. Tender paneer cubes simmered in a mildly sweet, rich, and creamy tomato-cashew onion gravy topped with butter and fresh coriander.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🥑 Balanced Nutrition",
    isVeg: true,
    rating: 4.9,
    reviews: 589,
    ingredients: [
      "250g paneer, cut into cubes",
      "1 large onion, chopped",
      "3 ripe tomatoes, chopped",
      "2 cloves garlic & 1 inch ginger, chopped",
      "10 whole cashews",
      "3 tbsp butter",
      "1/4 cup fresh heavy cream",
      "1 tsp Kashmiri red chili powder",
      "1 tsp garam masala",
      "1 tsp dried fenugreek leaves (kasuri methi)"
    ],
    instructions: [
      "In a pan, heat 1 tsp butter and sauté the onions, garlic, ginger, and cashews for 3-4 minutes until onions are soft.",
      "Add the chopped tomatoes and cook until they turn mushy. Cool and blend this mixture into a very smooth paste.",
      "Melt 2 tbsp butter in the same pan. Pour in the blended gravy and simmer for 5 minutes.",
      "Add red chili powder, salt, and half a cup of water. Bring to a boil.",
      "Gently drop in the paneer cubes (soak them in warm water first for extra softness) and simmer on low for 5 minutes.",
      "Stir in the cream, garam masala, and crushed kasuri methi. Garnish with a dollop of butter and serve with roti or jeera rice."
    ],
    nutrition: {
      calories: 380,
      protein: "14g",
      carbs: "14g",
      fat: "30g"
    }
  },
  {
    id: 26,
    title: "Dal Makhani",
    description: "A creamy North Indian specialty featuring whole black lentils and kidney beans slow-cooked overnight, enriched with butter, cream, and smoky spices.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    difficulty: "Hard",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.9,
    reviews: 412,
    ingredients: [
      "1 cup whole black lentils (urad dal, soaked overnight)",
      "1/4 cup red kidney beans (rajma, soaked overnight)",
      "3 large tomatoes, pureed",
      "1.5 tbsp ginger-garlic paste",
      "4 tbsp unsalted butter",
      "1/4 cup heavy cream",
      "1 tsp Kashmiri red chili powder",
      "1/2 tsp garam masala",
      "1 tsp kasuri methi"
    ],
    instructions: [
      "Boil soaked black lentils and kidney beans in a pressure cooker with 4 cups of water and salt for 30 minutes until they are completely tender and mashable.",
      "In a large heavy-bottomed pot, melt 2 tbsp butter. Add ginger-garlic paste and sauté for 1 minute.",
      "Add tomato puree and Kashmiri red chili powder. Sauté until the mixture thickens and releases butter.",
      "Pour in the cooked lentils and kidney beans along with their cooking liquid. Stir well and mash a portion of the lentils against the sides of the pot with the ladle to create a creamy texture.",
      "Simmer on very low heat for 35-40 minutes, stirring occasionally to prevent sticking. The slow cooking is key to the deep flavor.",
      "Stir in the remaining butter, heavy cream, garam masala, and crushed kasuri methi. Cook for 5 more minutes and serve with Butter Naan."
    ],
    nutrition: {
      calories: 320,
      protein: "13g",
      carbs: "36g",
      fat: "14g"
    }
  },
  {
    id: 27,
    title: "Palak Paneer",
    description: "A nutritious, bright green curry made of pureed blanched spinach cooked with garlic, onions, mild spices, and soft cubes of fresh paneer.",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Indian",
    diet: "Vegetarian",
    fitnessArchetype: "🏃 Athlete Fuel (Clean & Lean)",
    isVeg: true,
    rating: 4.8,
    reviews: 367,
    ingredients: [
      "2 large bunches fresh spinach leaves (palak)",
      "200g paneer, cut into cubes",
      "1 medium onion, finely chopped",
      "1 tomato, chopped",
      "1 tbsp ginger-garlic paste",
      "2 green chilies",
      "1/2 tsp cumin seeds",
      "2 tbsp cream",
      "1 tbsp butter or ghee",
      "1/2 tsp garam masala"
    ],
    instructions: [
      "Blanch spinach: Boil water, cook spinach leaves and green chilies for 2 minutes, then plunge immediately into ice-cold water (keeps it vibrant green). Drain and blend into a smooth puree.",
      "Heat ghee in a pan. Add cumin seeds and let them sizzle. Add chopped onions and ginger-garlic paste, and sauté until golden.",
      "Add chopped tomatoes and cook for 3 minutes until soft. Stir in red chili powder, coriander powder, and salt.",
      "Pour in the spinach puree and 1/4 cup water. Simmer on low heat for 5 minutes.",
      "Gently add the paneer cubes. Simmer for 3 minutes so the paneer absorbs the green gravy. Do not overcook paneer as it turns rubbery.",
      "Stir in the cream and garam masala. Serve hot with rotis or tandoori roti."
    ],
    nutrition: {
      calories: 270,
      protein: "13g",
      carbs: "9g",
      fat: "20g"
    }
  },
  // --- INDO-CHINESE ---
  {
    id: 28,
    title: "Chilli Paneer (Semi-Dry)",
    description: "A popular Indo-Chinese starter featuring crispy fried paneer cubes tossed in a tangy, spicy, and savory sauce with crunchy bell peppers and spring onions.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Chinese",
    diet: "Spicy",
    fitnessArchetype: "🏋️ Energy & Carb Loading",
    isVeg: true,
    rating: 4.8,
    reviews: 310,
    ingredients: [
      "200g paneer, cut into cubes",
      "2 tbsp cornflour (corn starch) & 2 tbsp all-purpose flour",
      "1 green bell pepper & 1 onion, cut into squares",
      "2 green chilies, sliced",
      "1 tbsp garlic, finely chopped",
      "1 tbsp ginger, finely chopped",
      "1.5 tbsp soy sauce",
      "1 tbsp chili sauce",
      "1 tbsp tomato ketchup",
      "3 tbsp spring onions, chopped",
      "Oil for frying"
    ],
    instructions: [
      "Coat paneer: Make a batter with cornflour, maida, salt, pepper, and a little water. Dip paneer cubes in the batter to coat them thinly. Shallow or deep fry in hot oil until light golden and crispy. Drain and set aside.",
      "Stir fry sauce: Heat 1.5 tbsp oil in a wok on high heat. Add chopped garlic, ginger, and green chilies. Sauté for 30 seconds.",
      "Add square bell peppers and onions. Stir fry on high heat for 1-2 minutes until slightly cooked but still crispy.",
      "Add soy sauce, chili sauce, ketchup, and 2 tbsp water. Mix well.",
      "Add 1 tsp cornflour dissolved in 2 tbsp water to the pan to thicken the sauce.",
      "Toss in the crispy paneer cubes and coat them evenly in the sauce. Stir in spring onions and serve hot immediately."
    ],
    nutrition: {
      calories: 320,
      protein: "12g",
      carbs: "18g",
      fat: "22g"
    }
  },
  {
    id: 29,
    title: "Veg Manchurian",
    description: "Deep-fried mixed vegetable balls cooked in a flavorful, spicy, and tangy Indo-Chinese gravy made with garlic, ginger, soy sauce, and vinegar.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    prepTime: 20,
    cookTime: 20,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Chinese",
    diet: "Vegetarian",
    fitnessArchetype: "🥑 Balanced Nutrition",
    isVeg: true,
    rating: 4.7,
    reviews: 245,
    ingredients: [
      "1.5 cups cabbage, finely shredded",
      "1/2 cup carrots, finely grated",
      "3 tbsp cornflour & 3 tbsp maida",
      "1 tbsp garlic & 1 tbsp ginger, finely chopped",
      "1.5 tbsp soy sauce",
      "1 tbsp green chili sauce",
      "1 tsp vinegar",
      "1 tsp black pepper",
      "Oil for frying",
      "Spring onion greens for garnish"
    ],
    instructions: [
      "Make veg balls: In a bowl, mix shredded cabbage, carrot, maida, cornflour, pepper, and salt. Squeeze the vegetables to release water and form a dough. Roll into small rounds.",
      "Deep fry the vegetable balls in hot oil until they are golden-brown and crispy. Drain and set aside.",
      "Make sauce: Heat 1 tbsp oil in a wok on high heat. Sauté garlic and ginger for 1 minute.",
      "Add soy sauce, green chili sauce, vinegar, and a pinch of sugar. Pour in 1 cup of water and bring to a simmer.",
      "Thicken the sauce by stirring in a slurry of 1 tsp cornflour mixed with 2 tbsp water.",
      "Add the fried vegetable balls into the gravy and simmer for 2 minutes so they absorb the sauce. Garnish with chopped spring onion greens and serve with fried rice."
    ],
    nutrition: {
      calories: 290,
      protein: "5g",
      carbs: "34g",
      fat: "15g"
    }
  },
  {
    id: 30,
    title: "Chicken Hakka Noodles",
    description: "Classic stir-fried Chinese noodles tossed with shredded chicken breast, crisp julienned vegetables, soy sauce, and aromatic garlic.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Chinese",
    diet: "High-Protein",
    fitnessArchetype: "🏋️ Energy & Carb Loading",
    isVeg: false,
    rating: 4.8,
    reviews: 367,
    ingredients: [
      "150g Hakka noodles",
      "150g chicken breast, boiled and shredded",
      "1/2 cup cabbage, carrots, and bell pepper, sliced into thin strips",
      "2 green chilies, sliced",
      "1 tbsp garlic, chopped",
      "1.5 tbsp soy sauce",
      "1 tbsp vinegar",
      "1/2 tsp white pepper powder",
      "2 tbsp spring onions, chopped",
      "2 tbsp oil"
    ],
    instructions: [
      "Boil noodles in salted water until al dente (slightly undercooked). Drain, rinse with cold water, toss with 1 tsp oil, and set aside.",
      "Heat 2 tbsp oil in a large wok over very high heat. Add chopped garlic and green chilies, and sauté for 30 seconds.",
      "Add sliced carrots, cabbage, and bell pepper. Stir fry on high heat for 2 minutes until slightly cooked but still crunchy.",
      "Add the shredded chicken and boiled noodles to the wok.",
      "Drizzle soy sauce, vinegar, salt, and white pepper over the noodles. Toss vigorously on high heat for 2-3 minutes to blend all ingredients.",
      "Stir in chopped spring onions, turn off the heat, and serve hot."
    ],
    nutrition: {
      calories: 420,
      protein: "24g",
      carbs: "52g",
      fat: "12g"
    }
  },
  {
    id: 31,
    title: "Veg Fried Rice",
    description: "Fluffy basmati rice stir-fried in a hot wok with finely chopped mixed vegetables, garlic, white pepper, and seasoned with soy sauce.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Chinese",
    diet: "Vegetarian",
    fitnessArchetype: "🏋️ Energy & Carb Loading",
    isVeg: true,
    rating: 4.8,
    reviews: 298,
    ingredients: [
      "2 cups cooked Basmati rice (cold and grains separated)",
      "1/2 cup mixed vegetables (carrots, beans, peas), finely chopped",
      "1 tbsp garlic, finely chopped",
      "1 tbsp ginger, finely chopped",
      "1.5 tbsp soy sauce",
      "1 tsp vinegar",
      "1/2 tsp white pepper powder",
      "3 tbsp spring onions, chopped",
      "1.5 tbsp oil"
    ],
    instructions: [
      "Heat oil in a wok on high heat. Add chopped garlic and ginger and sauté for 30 seconds.",
      "Add the chopped vegetables (carrots, beans, peas) and stir fry on high heat for 2 minutes.",
      "Add the cold cooked rice to the wok.",
      "Drizzle soy sauce, vinegar, white pepper powder, and salt. Stir fry and toss the rice gently to mix well without breaking the rice grains.",
      "Stir fry on high heat for 2 minutes until fragrant.",
      "Stir in spring onions and serve hot with Veg Manchurian."
    ],
    nutrition: {
      calories: 310,
      protein: "5g",
      carbs: "58g",
      fat: "6g"
    }
  }
];

const getRecipes = () => {
  const custom = localStorage.getItem("custom_recipes");
  const customList = custom ? JSON.parse(custom) : [];
  return [...DEFAULT_RECIPES, ...customList];
};

// Check if content contains beef or bee-related ingredients to satisfy "remove recipe having bee in it"
const containsBeef = (recipe) => {
  const titleText = (recipe.title || "").toLowerCase();
  const descText = (recipe.description || "").toLowerCase();
  
  // Exclude "beef" or "beer" or "bee"
  const isBeef = titleText.includes("beef") || descText.includes("beef") ||
                 titleText.includes(" beer") || descText.includes(" beer") ||
                 titleText.includes(" bee ") || descText.includes(" bee ") ||
                 titleText.startsWith("bee") || descText.startsWith("bee");

  if (isBeef) return true;

  if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
    return recipe.ingredients.some((ing) => {
      const ingText = String(ing).toLowerCase();
      return ingText.includes("beef") || ingText.includes(" beer") || ingText.includes(" bee ");
    });
  }

  return false;
};

// Parse TheMealDB response to our standard recipe format
const formatMeal = (meal) => {
  // Extract ingredients list
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure ? measure.trim() + " " : ""}${ingredient.trim()}`);
    }
  }

  // Parse steps from instructions
  const rawInstructions = meal.strInstructions || "Follow preparation guidelines.";
  const instructions = rawInstructions
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter((step) => step.length > 10 && !step.match(/^\d+\.?$/));

  const title = meal.strMeal;
  const dietCategory = meal.strCategory || "Regular";

  return {
    id: meal.idMeal,
    title: title,
    description: `A delicious ${meal.strArea || "General"} style ${dietCategory} prepared with fresh ingredients.`,
    image: meal.strMealThumb || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    cuisine: meal.strArea || "General",
    diet: dietCategory,
    fitnessArchetype: getFitnessArchetype(title, dietCategory, ingredients),
    isVeg: isVegCategory(title, dietCategory),
    rating: 4.7,
    reviews: 45,
    ingredients,
    instructions: instructions.length > 0 ? instructions : [rawInstructions],
    nutrition: {
      calories: 420,
      protein: "22g",
      carbs: "38g",
      fat: "14g"
    }
  };
};

export const api = {
  // Get all recipes with search & filters
  getAllRecipes: async ({ search = "", cuisine = "", diet = "", difficulty = "" } = {}) => {
    try {
      let results = [];
      const localList = getRecipes();

      if (search) {
        // First, search inside the local recipes
        const localMatches = localList.filter((r) => 
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(search.toLowerCase()) ||
          r.diet.toLowerCase().includes(search.toLowerCase()) ||
          (r.ingredients && r.ingredients.some(ing => String(ing).toLowerCase().includes(search.toLowerCase())))
        );

        // Concurrently query TheMealDB API
        try {
          const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`;
          const response = await axios.get(url);
          const meals = response.data.meals || [];
          const apiMatches = meals.map(formatMeal);
          
          // Combine and de-duplicate by title (case-insensitive)
          results = [...localMatches];
          apiMatches.forEach((apiMeal) => {
            if (!results.some((r) => r.title.toLowerCase() === apiMeal.title.toLowerCase())) {
              results.push(apiMeal);
            }
          });
        } catch (e) {
          console.error("TheMealDB API error during search, falling back to local matches", e);
          results = localMatches;
        }
      } else {
        // No search, show all local recipes
        results = localList;
      }

      // Filter out beef or bee-related recipes
      results = results.filter((r) => !containsBeef(r));

      // Apply client-side filters on top of search results
      if (cuisine) {
        results = results.filter((r) => r.cuisine.toLowerCase() === cuisine.toLowerCase());
      }
      if (diet) {
        results = results.filter((r) => 
          r.diet.toLowerCase() === diet.toLowerCase() || 
          r.title.toLowerCase().includes(diet.toLowerCase()) ||
          r.fitnessArchetype.toLowerCase().includes(diet.toLowerCase())
        );
      }
      if (difficulty) {
        results = results.filter((r) => r.difficulty.toLowerCase() === difficulty.toLowerCase());
      }

      return results;
    } catch (err) {
      console.error("Unexpected error in getAllRecipes, falling back to local database", err);
      return getRecipes().filter((r) => !containsBeef(r));
    }
  },

  // Get single recipe by ID
  getRecipeById: async (id) => {
    // If it's a mock ID or custom recipe (length >= 10 and starts with Date.now() timestamp, or 1-35)
    const isMockId = parseInt(id) <= 35 || String(id).length >= 10;

    if (!isMockId) {
      try {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        const response = await axios.get(url);
        const meals = response.data.meals;
        if (meals && meals.length > 0) {
          const recipe = formatMeal(meals[0]);
          if (containsBeef(recipe)) throw new Error("Recipe contains beef/bee and is hidden.");
          return recipe;
        }
      } catch (err) {
        console.error("TheMealDB Detail Fetch Error", err);
      }
    }

    // Fallback to local mock database
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = getRecipes();
    const recipe = list.find((r) => r.id === parseInt(id));
    if (!recipe) throw new Error("Recipe not found");
    return recipe;
  },

  // Create custom recipe
  createRecipe: async (recipeData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const custom = localStorage.getItem("custom_recipes");
    const customList = custom ? JSON.parse(custom) : [];
    
    const newRecipe = {
      ...recipeData,
      id: Date.now(),
      rating: 5.0,
      reviews: 0,
      fitnessArchetype: getFitnessArchetype(recipeData.title, recipeData.diet, recipeData.ingredients),
      isVeg: isVegCategory(recipeData.title, recipeData.diet),
      image: recipeData.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800"
    };

    customList.push(newRecipe);
    localStorage.setItem("custom_recipes", JSON.stringify(customList));
    return newRecipe;
  },

  // Favorites logic
  getFavorites: () => {
    const favs = localStorage.getItem("recipe_favorites");
    return favs ? JSON.parse(favs) : [];
  },

  toggleFavorite: (recipeId) => {
    const favs = api.getFavorites();
    const index = favs.indexOf(recipeId);
    if (index === -1) {
      favs.push(recipeId);
    } else {
      favs.splice(index, 1);
    }
    localStorage.setItem("recipe_favorites", JSON.stringify(favs));
    return favs;
  },

  isFavorite: (recipeId) => {
    const favs = api.getFavorites();
    return favs.includes(recipeId);
  }
};
