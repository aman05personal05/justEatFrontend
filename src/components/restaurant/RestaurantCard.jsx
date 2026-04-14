import { Link } from "react-router-dom";
import { Heart, MapPin, Star, UtensilsCrossed } from "lucide-react";

export default function RestaurantCard({ restaurant, isFav, onToggleFav }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 group">
      <div className="h-40 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 relative overflow-hidden">
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <UtensilsCrossed className="w-14 h-14 text-orange-300 dark:text-orange-700" />
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFav(restaurant.id);
          }}
          className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-all duration-200"
        >
          <Heart
            className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-500"}`}
          />
        </button>
        {restaurant.cuisine_type && (
          <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-semibold text-orange-600 dark:text-orange-400">
            {restaurant.cuisine_type}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {restaurant.name}
          </h2>
          {restaurant.rating && (
            <span className="flex items-center gap-1 text-sm font-semibold text-amber-500 ml-2 shrink-0 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              {Number(restaurant.rating).toFixed(1)}
            </span>
          )}
        </div>
        {restaurant.location && (
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5" /> {restaurant.location}
          </p>
        )}
        <Link
          to={`/restaurant/${restaurant.id}`}
          className="block w-full text-center bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}
