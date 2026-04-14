import { useEffect, useState } from "react";
import { ordersApi } from "../../api/orders";
import { menuItemsApi } from "../../api/menuItems";
import { restaurantsApi } from "../../api/restaurants";
import toast from "react-hot-toast";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Utensils,
} from "lucide-react";
import { format } from "date-fns";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const STATUS_CONFIG = {
  PENDING: {
    class: "status-pending",
    icon: Clock,
    label: "Pending",
  },
  CONFIRMED: {
    class: "status-confirmed",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  PREPARING: {
    class: "status-preparing",
    icon: Utensils,
    label: "Preparing",
  },
  READY: {
    class: "status-ready",
    icon: Package,
    label: "Ready",
  },
  COMPLETED: {
    class: "status-completed",
    icon: CheckCircle2,
    label: "Completed",
  },
  CANCELLED: {
    class: "status-cancelled",
    icon: XCircle,
    label: "Cancelled",
  },
};

const ALL_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [menuItemNames, setMenuItemNames] = useState({}); // Cache for menu item names
  const [restaurantNames, setRestaurantNames] = useState({}); // Cache for restaurant names

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await ordersApi.myOrders();
        setOrders(data);

        // Load menu item names and restaurant names for all orders
        const itemIds = new Set();
        const restaurantIds = new Set();

        data.forEach((order) => {
          restaurantIds.add(order.restaurant_id);
          order.order_items.forEach((oi) => {
            itemIds.add(`${order.restaurant_id}:${oi.menu_item_id}`);
          });
        });

        // Load restaurant names
        const restNames = {};
        for (const restId of restaurantIds) {
          try {
            const restRes = await restaurantsApi.get(restId);
            restNames[restId] = restRes.data.name;
          } catch {
            restNames[restId] = "Unknown Restaurant";
          }
        }
        setRestaurantNames(restNames);

        // Load menu item names
        const names = {};
        for (const key of itemIds) {
          const [restaurantId, menuItemId] = key.split(":");
          try {
            const itemRes = await menuItemsApi.get(restaurantId, menuItemId);
            names[menuItemId] = itemRes.data.name;
          } catch {
            names[menuItemId] = "Unknown Item";
          }
        }
        setMenuItemNames(names);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  // Get the primary item name for an order (first item or summary)
  const getOrderDisplayName = (order) => {
    if (order.order_items.length === 0) return "Empty Order";

    const firstItem = order.order_items[0];
    const firstName = menuItemNames[firstItem.menu_item_id] || "Loading...";

    if (order.order_items.length === 1) {
      return `${firstItem.quantity}× ${firstName}`;
    }

    const otherCount = order.order_items.length - 1;
    return `${firstName} +${otherCount} more`;
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    const orderName = getOrderDisplayName(o).toLowerCase();
    const restaurantName = (
      restaurantNames[o.restaurant_id] || ""
    ).toLowerCase();
    const matchSearch = search
      ? orderName.includes(search.toLowerCase()) ||
        restaurantName.includes(search.toLowerCase()) ||
        o.status.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
          <Package className="w-6 h-6 text-orange-500" />
        </div>
        My Orders
      </h1>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by item name or restaurant..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s]?.label || s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {orders.length === 0
              ? "No orders yet"
              : "No orders match your filters"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const StatusIcon = STATUS_CONFIG[order.status]?.icon || Package;
            const statusClass =
              STATUS_CONFIG[order.status]?.class ||
              "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200"
              >
                <button
                  onClick={() =>
                    setExpanded((prev) => (prev === order.id ? null : order.id))
                  }
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusClass}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {STATUS_CONFIG[order.status]?.label || order.status}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
                        {getOrderDisplayName(order)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {restaurantNames[order.restaurant_id] || "Loading..."} ·{" "}
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                          ₹{Number(order.total_amount).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {order.created_at
                          ? format(
                              new Date(order.created_at),
                              "dd MMM yyyy, HH:mm",
                            )
                          : "Just now"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {expanded === order.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {expanded === order.id && (
                  <div className="border-t border-gray-100 dark:border-gray-700 px-5 pb-5 pt-4 bg-gray-50/50 dark:bg-gray-900/30">
                    {order.special_instructions && (
                      <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                        <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">
                          Special Instructions
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {order.special_instructions}
                        </p>
                      </div>
                    )}
                    <div className="space-y-3">
                      {order.order_items.map((oi) => (
                        <div
                          key={oi.id}
                          className="flex justify-between items-center text-sm bg-white dark:bg-gray-800 p-3 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center text-xs font-bold">
                              {oi.quantity}×
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">
                              {menuItemNames[oi.menu_item_id] || "Loading..."}
                            </span>
                          </div>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            ₹{Number(oi.subtotal).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between font-bold text-base">
                      <span className="text-gray-700 dark:text-gray-300">
                        Total
                      </span>
                      <span className="text-orange-600 dark:text-orange-400">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
