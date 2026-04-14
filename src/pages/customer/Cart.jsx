import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi } from "../../api/cart";
import { ordersApi } from "../../api/orders";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useForm } from "react-hook-form";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const { register, handleSubmit } = useForm();

  const load = async () => {
    try {
      const { data } = await cartApi.get();
      setItems(data);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateQty = async (itemId, quantity) => {
    if (quantity < 1) return removeItem(itemId);
    try {
      const { data } = await cartApi.update(itemId, quantity);
      setItems((prev) => prev.map((i) => (i.id === itemId ? data : i)));
      refreshCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    const item = items.find((i) => i.id === itemId);
    try {
      await cartApi.remove(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      refreshCart();
      toast.success(`${item?.name || "Item"} removed from cart`);
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setItems([]);
      localStorage.removeItem("cart_restaurant_id");
      refreshCart();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const placeOrder = async ({ special_instructions }) => {
    const restaurantId = localStorage.getItem("cart_restaurant_id");
    if (!restaurantId) {
      toast.error(
        "Restaurant info missing. Please add items from a restaurant page.",
      );
      return;
    }
    setPlacing(true);
    try {
      await ordersApi.place({
        restaurant_id: restaurantId,
        items: items.map((i) => ({
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
        })),
        special_instructions: special_instructions || undefined,
      });
      await cartApi.clear();
      localStorage.removeItem("cart_restaurant_id");
      refreshCart();
      toast.success("Order placed! 🎉");
      navigate("/orders");
    } catch (err) {
      // Extract item name from error if available
      const errorDetail = err.response?.data?.detail || "Failed to place order";
      toast.error(errorDetail);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const total = items.reduce((sum, i) => sum + Number(i.subtotal), 0);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Continue shopping
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
          </div>
          Your Cart
          {items.length > 0 && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({items.length} item{items.length !== 1 ? "s" : ""})
            </span>
          )}
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <X className="w-4 h-4" /> Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            Your cart is empty
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
            Add some delicious items to get started
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-7 h-7 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ₹{Number(item.unit_price).toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-bold text-gray-900 dark:text-white w-20 text-right">
                  ₹{Number(item.subtotal).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex justify-between text-xl font-bold mb-6">
              <span className="text-gray-700 dark:text-gray-300">Total</span>
              <span className="text-orange-600 dark:text-orange-400">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <form onSubmit={handleSubmit(placeOrder)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Special instructions (optional)
                </label>
                <textarea
                  {...register("special_instructions")}
                  rows={2}
                  placeholder="Allergies, preferences, delivery notes…"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 resize-none text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={placing}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {placing
                  ? "Placing order…"
                  : `Place Order · ₹${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
