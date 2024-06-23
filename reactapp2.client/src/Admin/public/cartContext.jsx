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
        getItem = getItem.filter(x => x.id != id); // first we filter item not having that we want to update
        const obj = { // we create a new instance of updated object
          id,
          qty: updatedItems[existingItemIndex].quantity,
          size: updatedItems[existingItemIndex].size = size
        }
        getItem.push(obj); // we assign it 
        localStorage.setItem("cart", JSON.stringify(getItem));
        setItems(updatedItems);
      }
    } else {
      localStorage.setItem(
        "cart",
        JSON.stringify([
          {
            id,
            qty: 1,
            size,
          },
        ])
      );
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
            item.map((i) => {
              const id = i.id;
              const p = value.find((x) => x.id === id);
              setItems([{ p, quantity: i.qty, size: i.size }]);
              setList(true);
            });
          });
      }
    }
  }, []);


  const deleteCart = (id) => {
    let cartItems = [...items];
    cartItems = cartItems.filter((x) => x.p.id !== id);
    // remove from local storage too

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
