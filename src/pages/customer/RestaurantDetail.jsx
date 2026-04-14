import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { restaurantsApi } from "../../api/restaurants";
import { menuItemsApi } from "../../api/menuItems";
import { cartApi } from "../../api/cart";
import { favouritesApi } from "../../api/favourites";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Flame,
  Heart,
  MapPin,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import MenuItemCard from "../../components/restaurant/MenuItemCard";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [mostlyOrdered, setMostlyOrdered] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [restRes, menuRes, favRes, mostlyRes] = await Promise.all([
          restaurantsApi.get(id),
          menuItemsApi.list(id),
          favouritesApi.list(),
          menuItemsApi.mostlyOrdered(id).catch(() => ({ data: [] })),
        ]);
        setRestaurant(restRes.data);
        setMenuItems(
          menuRes.data.map((item) => ({ ...item, restaurant_id: id })),
        );
        setIsFav(favRes.data.some((r) => r.id === id));
        setMostlyOrdered(
          mostlyRes.data.map((item) => ({ ...item, restaurant_id: id })),
        );
      } catch {
        toast.error("Failed to load restaurant");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const toggleFav = async () => {
    try {
      if (isFav) {
        await favouritesApi.remove(id);
        setIsFav(false);
        toast.success("Removed from favourites");
      } else {
        await favouritesApi.add(id);
        setIsFav(true);
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
        localStorage.setItem("cart_restaurant_id", id);
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
      if (errorMsg.includes("unavailable")) {
        toast.error(`${item.name} is currently unavailable`);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!restaurant) return null;

  const categories = [...new Set(menuItems.map((m) => m.category || "Other"))];

  const filtered = menuItems.filter((item) => {
    const matchCat = categoryFilter
      ? (item.category || "Other") === categoryFilter
      : true;
    const matchMin = minPrice ? Number(item.price) >= Number(minPrice) : true;
    const matchMax = maxPrice ? Number(item.price) <= Number(maxPrice) : true;
    const matchSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;
    return matchCat && matchMin && matchMax && matchSearch;
  });

  const grouped = Object.fromEntries(
    categories.map((cat) => [
      cat,
      filtered.filter((m) => (m.category || "Other") === cat),
    ]),
  );

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to restaurants
      </button>

      {/* Restaurant header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8 shadow-sm">
        <div className="h-48 sm:h-56 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 relative">
          {restaurant.image_url ? (
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <UtensilsCrossed className="w-20 h-20 text-orange-300 dark:text-orange-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="p-6 -mt-16 relative">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {restaurant.name}
              </h1>
              {restaurant.cuisine_type && (
                <span className="inline-block mt-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-sm font-semibold rounded-full">
                  {restaurant.cuisine_type}
                </span>
              )}
              {restaurant.location && (
                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4" /> {restaurant.location}
                </p>
              )}
              {restaurant.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-2">
                  {restaurant.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {restaurant.rating && (
                <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold px-3 py-2 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-500" />
                  {Number(restaurant.rating).toFixed(1)}
                </span>
              )}
              <button
                onClick={toggleFav}
                className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> View Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mostly Ordered section */}
      {mostlyOrdered.length > 0 && (
        <div className="mb-8 animate-slide-up">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-xl">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            Popular Items
          </h2>
          <div className="space-y-3">
            {mostlyOrdered.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAdd={addToCart}
                addingId={addingId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-xl">
            <UtensilsCrossed className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          Full Menu
        </h2>

        <div className="flex items-center gap-3 flex-1 justify-end">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 text-sm border rounded-xl px-4 py-2.5 transition-all ${
              showFilters
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-end shadow-sm animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Min Price (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0.00"
              className="w-28 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Max Price (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              className="w-28 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setCategoryFilter("");
              setSearchQuery("");
            }}
            className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 px-4 py-2.5 font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Menu grouped by category */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">
            No items match your filters.
          </p>
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setCategoryFilter("");
              setSearchQuery("");
            }}
            className="mt-3 text-orange-500 hover:text-orange-600 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        categories.map((cat) =>
          grouped[cat]?.length > 0 ? (
            <div key={cat} className="mb-8 animate-slide-up">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                {cat}
                <span className="text-xs font-normal text-gray-400 ml-2">
                  ({grouped[cat].length})
                </span>
              </h3>
              <div className="space-y-3">
                {grouped[cat].map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAdd={addToCart}
                    addingId={addingId}
                  />
                ))}
              </div>
            </div>
          ) : null,
        )
      )}
    </div>
  );
}
