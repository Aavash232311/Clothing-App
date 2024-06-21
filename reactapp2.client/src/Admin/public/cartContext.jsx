import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export default CartContext;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (id) => {
    const existingItemIndex = items.findIndex((item) => item.id === id);
    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      if (updatedItems[existingItemIndex].quantity >= 10) {
        alert("Contact at company number to order more than 10 items");
      } else {
        updatedItems[existingItemIndex].quantity++;
        setItems(updatedItems);
      }
    } else {
      setItems([...items, { id, quantity: 1 }]);
    }
  };

  return (
    <CartContext.Provider value={{ addToCart, items }}>
      {children}
    </CartContext.Provider>
  );
};
