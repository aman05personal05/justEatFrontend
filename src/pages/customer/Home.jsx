import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantsApi } from "../../api/restaurants";
import { favouritesApi } from "../../api/favourites";
import { recommendationsApi } from "../../api/recommendations";
import { menuItemsApi } from "../../api/menuItems";
import { cartApi } from "../../api/cart";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import {
  Search,
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  TrendingUp,
  X,
  Store,
} from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import MenuItemCard from "../../components/restaurant/MenuItemCard";

// Categories for quick filters
const CATEGORIES = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "burger", name: "Burgers", icon: "🍔" },
  { id: "dessert", name: "Desserts", icon: "🍰" },
  { id: "indian", name: "Indian", icon: "🍛" },
  { id: "chinese", name: "Chinese", icon: "🥡" },
  { id: "italian", name: "Italian", icon: "🍝" },
  { id: "mexican", name: "Mexican", icon: "🌮" },
  { id: "sushi", name: "Sushi", icon: "🍣" },
  { id: "salad", name: "Salads", icon: "🥗" },
];

export default function Home() {
  const navigate = useNavigate();
  const { updateCartCount, refreshCart } = useCart();

  const [restaurants, setRestaurants] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Food search results
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [showFoodSearch, setShowFoodSearch] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [restRes, favRes, recRes] = await Promise.all([
          restaurantsApi.list(),
          favouritesApi.list(),
          recommendationsApi.get().catch(() => ({ data: [] })),
        ]);
        setRestaurants(restRes.data);
        setFavouriteIds(new Set(favRes.data.map((r) => r.id)));
        setRecommendations(recRes.data);

        // Get recommended menu items based on user's order history
        try {
          const itemsRes = await recommendationsApi.getMenuItems();
          setRecommendedItems(itemsRes.data || []);
        } catch {
          // If endpoint doesn't exist, generate recommendations from restaurants
          generateRecommendedItems(restRes.data);
        }
      } catch {
        toast.error("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Generate recommended items from restaurants' menu items
  const generateRecommendedItems = async (restaurantList) => {
    try {
      const items = [];
      // Get menu items from first 3 restaurants
      for (const rest of restaurantList.slice(0, 3)) {
        const menuRes = await menuItemsApi.list(rest.id);
        const popular = menuRes.data
          .filter((item) => item.is_available)
          .sort((a, b) => (b.order_count || 0) - (a.order_count || 0))
          .slice(0, 2)
          .map((item) => ({ ...item, restaurant_name: rest.name }));
        items.push(...popular);
      }
      setRecommendedItems(items.slice(0, 6));
    } catch {
      // Ignore errors
    }
  };

  // Debounced food search
  useEffect(() => {
    if (!search || search.length < 2) {
      setSearchResults([]);
      setShowFoodSearch(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setSearchLoading(true);
      setShowFoodSearch(true);

      try {
        // Search in all menu items across restaurants
        const results = [];
        const searchLower = search.toLowerCase();

        for (const rest of restaurants) {
          try {
            const menuRes = await menuItemsApi.list(rest.id);
            const matchingItems = menuRes.data
              .filter(
                (item) =>
                  item.is_available &&
                  (item.name.toLowerCase().includes(searchLower) ||
                    (item.description || "")
                      .toLowerCase()
                      .includes(searchLower) ||
                    (item.category || "").toLowerCase().includes(searchLower)),
              )
              .map((item) => ({
                ...item,
                restaurant_id: rest.id,
                restaurant_name: rest.name,
              }));
            results.push(...matchingItems);
          } catch {
            // Ignore individual restaurant errors
          }
        }

        setSearchResults(results.slice(0, 20));
      } catch {
        toast.error("Search failed");
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [search, restaurants]);

  const toggleFavourite = async (restaurantId) => {
    const isFav = favouriteIds.has(restaurantId);
    try {
      if (isFav) {
        await favouritesApi.remove(restaurantId);
        setFavouriteIds((prev) => {
          const s = new Set(prev);
          s.delete(restaurantId);
          return s;
        });
        toast.success("Removed from favourites");
      } else {
        await favouritesApi.add(restaurantId);
        setFavouriteIds((prev) => new Set([...prev, restaurantId]));
        toast.success("Added to favourites");
      }
    } catch {
      toast.error("Could not update favourites");
    }
  };

  const addToCart = async (item, quantityChange = 1) => {
    if (!item.is_available) {
      toast.error(`${item.name} is currently unavailable`);
      return;
    }

    setAddingId(item.id);
    try {
      if (quantityChange > 0) {
        await cartApi.add(item.id, 1);
        localStorage.setItem("cart_restaurant_id", item.restaurant_id);
        toast.success(`${item.name} added to cart`);
      } else {
        // Get current cart to find the cart item id
        const { data: cartItems } = await cartApi.get();
        const cartItem = cartItems.find((ci) => ci.menu_item_id === item.id);
        if (cartItem) {
          if (cartItem.quantity <= 1) {
            await cartApi.remove(cartItem.id);
          } else {
            await cartApi.update(cartItem.id, cartItem.quantity - 1);
          }
        }
      }
      refreshCart();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to update cart";
      // Check if error contains item name info
      if (errorMsg.includes("unavailable")) {
        toast.error(`${item.name} is currently unavailable`);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setAddingId(null);
    }
  };

  const cuisines = [
    ...new Set(restaurants.map((r) => r.cuisine_type).filter(Boolean)),
  ];

  // Filter by category
  const filterByCategory = (items) => {
    if (activeCategory === "all") return items;
    const categoryLower = activeCategory.toLowerCase();
    return items.filter(
      (r) =>
        (r.cuisine_type || "").toLowerCase().includes(categoryLower) ||
        (r.name || "").toLowerCase().includes(categoryLower),
    );
  };

  const filtered = filterByCategory(restaurants).filter((r) => {
    const matchSearch = search
      ? r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.location || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.cuisine_type || "").toLowerCase().includes(search.toLowerCase())
      : true;
    const matchCuisine = cuisineFilter
      ? r.cuisine_type === cuisineFilter
      : true;
    return matchSearch && matchCuisine;
  });

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          What are you craving?{" "}
          <span className="inline-block animate-bounce">🍔</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Discover delicious food from the best restaurants
        </p>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for food, restaurants, or cuisines..."
                className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 shadow-sm transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setShowFoodSearch(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              className="px-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 shadow-sm"
            >
              <option value="">All cuisines</option>
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Food Search Results Dropdown */}
          {showFoodSearch && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-orange-500" />
                  {searchLoading
                    ? "Searching..."
                    : `${searchResults.length} items found`}
                </span>
                <button
                  onClick={() => setShowFoodSearch(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {searchLoading ? (
                <div className="p-8 text-center">
                  <LoadingSpinner />
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No food items found for "{search}"</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {searchResults.map((item) => (
                    <MenuItemCard
                      key={`${item.restaurant_id}-${item.id}`}
                      item={item}
                      onAdd={addToCart}
                      addingId={addingId}
                      showRestaurant={true}
                      restaurantName={item.restaurant_name}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:text-orange-600 dark:hover:text-orange-400"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Items - Only show when not searching */}
      {recommendedItems.length > 0 &&
        !search &&
        !cuisineFilter &&
        activeCategory === "all" && (
          <div className="mb-10 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/40 dark:to-pink-900/40 rounded-xl">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {recommendedItems.slice(0, 4).map((item, idx) => (
                <MenuItemCard
                  key={`rec-${item.id}-${idx}`}
                  item={item}
                  onAdd={addToCart}
                  addingId={addingId}
                  showRestaurant={true}
                  restaurantName={item.restaurant_name}
                />
              ))}
            </div>
          </div>
        )}

      {/* Restaurant Recommendations - Only show when not searching */}
      {recommendations.length > 0 &&
        !search &&
        !cuisineFilter &&
        activeCategory === "all" && (
          <div
            className="mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl">
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              Your Favourite Spots
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  isFav={favouriteIds.has(r.id)}
                  onToggleFav={toggleFavourite}
                />
              ))}
            </div>
          </div>
        )}

      {/* All Restaurants */}
      <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 rounded-xl">
            <Store className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          {search || cuisineFilter || activeCategory !== "all"
            ? `Results (${filtered.length})`
            : "All Restaurants"}
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              No restaurants found
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCuisineFilter("");
                setActiveCategory("all");
              }}
              className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFav={favouriteIds.has(restaurant.id)}
                onToggleFav={toggleFavourite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
