import React, { Component } from "react";
import Nav from "../../Nav";
import "../../static/cart.css";
import CartContext from "./cartContext";
class Bag extends Component {
  state = {
    product: null,
    price: 0,
    shipping: 80,
  };
  static contextType = CartContext;
  componentDidMount() {
    const item = localStorage.getItem("cart");
    if (item === null) return;
    this.setState({ product: JSON.parse(item) });
  }
  render() {
    const { items } = this.context;
    let Subtotal = 0;
    items.map((i) => {
      Subtotal += i.p.price * i.quantity;
    });
    return (
      <div style={{ height: "auto", backgroundColor: "#f6f5f7" }}>
        <Nav />
        <br />
        {this.state.product !== null ? (
          <>
            <center>
              <div id="cart-view">
                <div id="checkout-products">
                  <div className="roboto-condensed-light cart-label-title">
                    Bag
                  </div>
                  <div className="cart-product">
                    <CartContext.Consumer>
                      {(value) => {
                        const { items } = value;
                        if (items.length === 0) return;
                        return (
                          <div key={Math.random(0, 1000)}>
                            {items.map((i) => {
                              const product = i.p;
                              return (
                                <div
                                  className="cart-product-frame"
                                  key={Math.random(0, 100)}
                                >
                                  <div className="cart-img-frame">
                                    <img
                                      height="150"
                                      width="100%"
                                      src={product.images[0]}
                                    ></img>
                                  </div>
                                  <div className="cart-product-info">
                                    <hr style={{ visibility: "hidden" }} />
                                    <ul style={{ listStyle: "none" }}>
                                      <li className="topListCart">
                                        {product.name}
                                        <span className="price-cart-label">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-currency-rupee"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                                          </svg>{" "}
                                          {product.price}
                                        </span>
                                      </li>
                                      <li className="product-cart-font">
                                        {product.gender === "male"
                                          ? "Men's"
                                          : "Women's"}
                                      </li>
                                      <li className="product-cart-font">
                                        Size:
                                        <select
                                          defaultValue={i.size}
                                          className="cart-options"
                                        >
                                          {product.avalibleSize.map((k, l) => {
                                            return (
                                              <option key={l} value={k}>
                                                {k}
                                              </option>
                                            );
                                          })}
                                        </select>{" "}
                                        Quantity:
                                        <select
                                          defaultValue={i.quantity}
                                          className="qty-cart"
                                        >
                                          {Array.from(
                                            { length: 10 },
                                            (_, index) => (
                                              <option
                                                key={index}
                                                value={index + 1}
                                              >
                                                {index + 1}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </li>
                                      <li className="product-cart-font">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-suit-heart cart-dim"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                                        </svg>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-trash cart-dim"
                                          viewBox="0 0 16 16"
                                          style={{ marginLeft: "10px" }}
                                        >
                                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }}
                    </CartContext.Consumer>
                  </div>
                </div>
                <div>
                  <div className="roboto-condensed-light cart-label-title">
                    Summary
                  </div>{" "}
                  <br />
                  <div className="classic-label summary-labels">
                    Subtotal
                    <span className="summary-labes-right">Rs: {Subtotal}</span>
                  </div>
                  <div className="classic-label summary-labels">
                    Estimated Delivery Charge
                    <span className="summary-labes-right">
                      Rs: {this.state.shipping}
                    </span>
                  </div>
                  <div className="classic-label summary-labels">
                    Total
                    <span className="summary-labes-right">
                      Rs: {this.state.shipping + Subtotal}
                    </span>
                  </div>
                  <hr />
                  <button className="button-28-black" id="checkout-cart">
                    Checkout
                  </button>
                </div>
              </div>
            </center>
          </>
        ) : (
          <>
            <center>
              <div className="roboto-condensed-light">Shop to add to cart!</div>
            </center>
          </>
        )}
      </div>
    );
  }
}

export default Bag;
