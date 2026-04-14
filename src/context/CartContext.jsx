import React, { createContext, useContext, useEffect, useState } from "react";
import { cartApi } from "../api/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCounts, setCartCounts] = useState({}); // { menuItemId: quantity }

  const loadCart = async () => {
    try {
      const { data } = await cartApi.get();
      setCartItems(data);
      const counts = {};
      data.forEach((item) => {
        counts[item.menu_item_id] = item.quantity;
      });
      setCartCounts(counts);
    } catch {
      // Ignore errors on cart load
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      loadCart();
    }
  }, []);

  const getItemCount = (menuItemId) => cartCounts[menuItemId] || 0;

  const updateCartCount = (menuItemId, quantity) => {
    if (quantity > 0) {
      setCartCounts((prev) => ({ ...prev, [menuItemId]: quantity }));
    } else {
      setCartCounts((prev) => {
        const next = { ...prev };
        delete next[menuItemId];
        return next;
      });
    }
  };

  const refreshCart = loadCart;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCounts,
        getItemCount,
        updateCartCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
