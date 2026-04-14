import { Flame, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function MenuItemCard({
  item,
  onAdd,
  addingId,
  showRestaurant = false,
  restaurantName = "",
}) {
  const { getItemCount } = useCart();
  const itemCount = getItemCount(item.id);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-900/50 ${!item.is_available ? "opacity-50" : ""}`}
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-20 h-20 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-8 h-8 text-orange-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {item.name}
          </h3>
          {item.is_special && (
            <span className="text-[10px] bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
              Chef's Pick
            </span>
          )}
          {item.order_count >= 10 && (
            <span className="text-[10px] bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3" /> Popular
            </span>
          )}
          {!item.is_available && (
            <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
              Sold Out
            </span>
          )}
        </div>
        {showRestaurant && restaurantName && (
          <p className="text-xs text-orange-500 dark:text-orange-400 font-medium mb-1">
            {restaurantName}
          </p>
        )}
        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {item.description}
          </p>
        )}
        {item.category && (
          <span className="inline-block mt-1.5 text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        )}
        <p className="text-orange-600 dark:text-orange-400 font-bold mt-2 text-lg">
          ₹{Number(item.price).toFixed(2)}
        </p>
      </div>

      {itemCount > 0 ? (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onAdd(item, -1)}
            disabled={!item.is_available || addingId === item.id}
            className="w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/60 disabled:opacity-50 transition-all duration-200"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-bold text-orange-600 dark:text-orange-400">
            {itemCount}
          </span>
          <button
            onClick={() => onAdd(item, 1)}
            disabled={!item.is_available || addingId === item.id}
            className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => onAdd(item, 1)}
          disabled={!item.is_available || addingId === item.id}
          className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          {addingId === item.id ? "…" : "Add"}
        </button>
      )}
    </div>
  );
}
