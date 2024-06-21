import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export default CartContext;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (p) => {
    const id = p.id
    const existingItemIndex = items.findIndex((item) => item.p.id === id);
    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      if (updatedItems[existingItemIndex].quantity >= 10) {
        alert("Contact at company number to order more than 10 items");
      } else {
        updatedItems[existingItemIndex].quantity++;
        setItems(updatedItems);
      }
    } else {
      setItems([...items, { p, quantity: 1 }]);
    }
  };

  const deleteCart = (id) => {
    let cartItems = [...items];
    cartItems = cartItems.filter(x => x.p.id !== id);
    setItems(cartItems);
  }

  return (
    <CartContext.Provider value={{ addToCart, items, deleteCart }}>
      {children}
    </CartContext.Provider>
  );
};
