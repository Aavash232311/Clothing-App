import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export default CartContext;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [list, setList] = useState(false);

  const addToCart = (p, size) => {
    const id = p.id;
    const existingItemIndex = items.findIndex((item) => item.p.id === id);
    // we need to assign id, quatntity and size to the local storage and even update if necessary
    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      if (updatedItems[existingItemIndex].quantity >= 10) {
        alert("Contact at company number to order more than 10 items");
      } else {
        updatedItems[existingItemIndex].quantity++;
        updatedItems[existingItemIndex].size = size;
        // here update in local storage too
        let getItem = JSON.parse(localStorage.getItem("cart"));
        getItem = getItem.filter((x) => x.id != id); // first we filter item not having that we want to update
        const obj = {
          // we create a new instance of updated object
          id,
          qty: updatedItems[existingItemIndex].quantity,
          size: (updatedItems[existingItemIndex].size = size),
        };
        getItem.push(obj); // we assign it
        localStorage.setItem("cart", JSON.stringify(getItem));
        setItems(updatedItems);
      }
    } else {
      // we need first check to see if its null.
      // if not null then we need to appened it because we might have some other object already
      let cart = localStorage.getItem("cart");
      const obj = {
        id,
        qty: 1,
        size,
      };
      if (cart === null) {
        localStorage.setItem("cart", JSON.stringify([obj]));
      } else {
        let getItem = JSON.parse(localStorage.getItem("cart"));
        getItem.push(obj);
        localStorage.setItem("cart", JSON.stringify(getItem));
      }
      setItems([...items, { p, quantity: 1, size }]);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("cart") != null) {
      let item = JSON.parse(localStorage.getItem("cart"));
      const ids = [];
      if (item !== null && item.length > 0) {
        // loading from local storage
        item.map((i) => {
          ids.push(i.id);
        });
        // once the page is reloaded for
        // optimization (just storing the id) purpose we are
        // re fetching the data from the server
        fetch("/public/product-by-array", {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: ids,
          }),
        })
          .then((rsp) => rsp.json())
          .then((response) => {
            const { statusCode, value } = response;
            if (statusCode !== 200) return;
            // map over item, get item having particular id, structure it well and push in current state
            const temp = [];
            item.map((i) => {
              const id = i.id;
              // from the local storage we are getting data
              // we need to structure it like the initial data so
              var p = value.find((x) => x.id == id);
              temp.push({
                p,
                size: i.size,
                quantity: i.qty,
              });
            });
            setItems(temp);
          });
      }
    }
  }, []);

  const deleteCart = (id) => {
    let cartItems = [...items];
    cartItems = cartItems.filter((x) => x.p.id !== id);
    // remove from local storage too
    let getItem = JSON.parse(localStorage.getItem("cart"));
    getItem = getItem.filter((x) => x.id != id);
    localStorage.setItem("cart", JSON.stringify(getItem));
    setItems(cartItems);
  };
  return (
    <CartContext.Provider
      value={{ addToCart, items, deleteCart, list, setList }}
    >
      {children}
    </CartContext.Provider>
  );
};
