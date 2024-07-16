import React, { Component } from "react";
import Nav from "../../Nav";
import "../../static/view.css";
import CartContext, { CartProvider } from "./cartContext";
class View extends Component {
  constructor(props) {
    super(props);
    this.searchParams = new URLSearchParams(window.location.search);
    this.id = this.searchParams.get("key");
    this.componentDidMount = this.componentDidMount.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.setSize = this.setSize.bind(this);
  }
  // todo: category based search, based on gender, based on price, based on sales, based on brand
  state = {
    product: null,
    image: 0,
    size: [],
    options: null,
  };
  componentDidMount() {
    fetch(`/public/get-product?id=${this.id}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode === 200) {
          this.setState({ product: value }, () => {
            // lets first um add; avalible options to one array
            const { options } = this.state.product;
            let categoryOfOptionsArray = []; // specity category of types array
            for (let i in options) {
              const elem = options[i].type;
              if (categoryOfOptionsArray.indexOf(elem) === -1) {
                categoryOfOptionsArray.push(elem);
              }
            }
            for (let i in categoryOfOptionsArray) {
              const obj = {
                key: categoryOfOptionsArray[i],
                value: options.filter(
                  (x) => x.type === categoryOfOptionsArray[i]
                ),
              };
              categoryOfOptionsArray[i] = obj;
            }
            this.setState({ options: categoryOfOptionsArray });
          });
        }
      });
  }
  previewImage(val) {
    this.setState({ image: val });
  }
  setSize(options) {
    // here if not the same type then update
    // if the same type then replace yk what i mean
    const iterable = [...this.state.size];
    const checkForSameType = iterable.find((x) => x.type === options.type);
    if (checkForSameType === undefined) {
      this.setState(
        (prevState) => ({
          size: [...prevState.size, options],
        }),
        () => {
          select();
        }
      );
    } else {
      const filter = [...iterable.filter((x) => x.type != options.type)];
      filter.push(options);
      this.setState({ size: filter }, () => {
        select();
      });
    }
    const select = () => {
      const newIterable = [...this.state.size];
      const elem = document.getElementsByClassName("grid-sizes");
      for (let i = 0; i <= elem.length - 1; i++) {
        const text = elem[i].children[0].innerText;
        const check = newIterable.find((x) => x.name === text);
        if (check !== undefined) {
          elem[i].style.border = "1px solid black";
        } else {
          elem[i].style.border = "1px solid rgb(185, 185, 185)";
        }
      }
    };
  }
  static contextType = CartContext;
  render() {
    const { items } = this.context;
    return (
      <div id="view-bg-frame">
        <Nav />
        {this.state.product != null ? (
          <div>
            <center>
              <div id="view-product-box-grid">
                <div id="product-orientation-frame">
                  <div id="image-orientation-frame">
                    <div className="image-prv-grid" id="image-slot-1">
                      {this.state.product.images.map((i, j) => {
                        return (
                          <div key={Math.random(0, i) + j}>
                            <div className="preview-iamges">
                              <img
                                className="move-iamges"
                                onMouseOver={() => {
                                  this.previewImage(j);
                                }}
                                onTouchStart={() => {
                                  this.previewImage(j);
                                }}
                                width="100%"
                                height="auto"
                                src={i}
                              ></img>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div id="image-slot-2">
                      <img
                        height="auto"
                        width="100%"
                        src={this.state.product.images[this.state.image]}
                      ></img>
                    </div>
                  </div>
                </div>
                <div id="info-div-view-products">
                  <br />
                  <div id="product-info">
                    <div className="roboto-condensed-light view-product-label">
                      {this.state.product.name}
                    </div>
                    <hr style={{ visibility: "hidden", height: "30px" }}></hr>
                    <div className="classic-label view-product-label">
                      {this.state.product.gender === "male"
                        ? "Men's"
                        : "Women's"}
                    </div>
                    <hr style={{ visibility: "hidden", height: "30px" }}></hr>
                    <div
                      className="roboto-condensed-light view-product-label"
                      style={{ fontWeight: "bold" }}
                    >
                      Rs {this.state.product.price}
                    </div>
                    <hr style={{ visibility: "hidden", height: "20px" }}></hr>
                    <div className="view-product-label">
                      incl. of taxes (Also includes all applicable duties)
                    </div>
                    <CartContext.Consumer>
                      {(services) => {
                        return (
                          <>
                            {this.state.options != null ? (
                              <div className="product-options-select-frame">
                                {this.state.options.map((i, j) => {
                                  const { value, key } = i;
                                  return (
                                    <div key={Math.random(0, 1000)}>
                                      <div className="classic-label">{key}</div>
                                      <div
                                        id="select-product-size"
                                        className="grid-container-size"
                                      >
                                        {value.map((l, m) => {
                                          return (
                                            <div
                                              className="grid-sizes"
                                              key={Math.random(0, 1000)}
                                              onClick={() => {
                                                this.setSize(l);
                                              }}
                                            >
                                              <div
                                                className="grid-labels-size"
                                                style={{ marginTop: "15px" }}
                                              >
                                                {l.name}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                                <button
                                  className="button-28 view-product-label"
                                  id="add-to-cart"
                                  onClick={() => {
                                    if (this.state.size === null) {
                                      alert("No size selected");
                                      return;
                                    }
                                    const checkForExisting = items.find(
                                      (x) => x.p.id === this.state.product.id
                                    );
                                    if (checkForExisting === undefined) {
                                      services.addToCart(
                                        this.state.product,
                                        this.state.size,
                                        null
                                      );
                                    }
                                    if (window.innerWidth >= 920) {
                                      services.setList(true);
                                    }
                                  }}
                                >
                                  Add to cart
                                </button>
                                <hr
                                  style={{
                                    visibility: "hidden",
                                    height: "20px",
                                  }}
                                />
                              </div>
                            ) : null}
                          </>
                        );
                      }}
                    </CartContext.Consumer>
                    <div
                      id="des"
                      className="classic-label view-product-label"
                      style={{ marginTop: "10px" }}
                    >
                      <div
                        className="roboto-condensed-light"
                        style={{ textAlign: "left" }}
                      >
                        About
                      </div>{" "}
                      <div
                        className="custom-table"
                        dangerouslySetInnerHTML={{
                          __html: this.state.product.description,
                        }}
                      ></div>
                      <br />
                      <div
                        className="roboto-condensed-light"
                        style={{ textAlign: "left" }}
                      >
                        Delivery
                      </div>{" "}
                      All purchases are subject to delivery fees (4–10) business
                      days
                      <div
                        className="roboto-condensed-light"
                        style={{ textAlign: "left" }}
                      >
                        Dimension
                      </div>{" "}
                      <div className="wrapped-text">
                        Height: {this.state.product.height} cm <br />
                        Length: {this.state.product.length} cm <br />
                        Breadth: {this.state.product.breadth} cm <br />
                      </div>
                      {this.state.product.warrantyInfo != "" ? (
                        <>
                          <div
                            className="roboto-condensed-light"
                            style={{ textAlign: "left" }}
                          >
                            Warranty Info
                          </div>{" "}
                          <div className="wrapped-text">
                            {this.state.product.warrantyInfo}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </center>
          </div>
        ) : null}
      </div>
    );
  }
}

export default View;
