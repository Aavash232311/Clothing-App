import React, { Component } from "react";
import Nav from "../../Nav";
import "../../static/view.css";
class View extends Component {
  constructor(props) {
    super(props);
    this.searchParams = new URLSearchParams(window.location.search);
    this.id = this.searchParams.get("key");
    this.componentDidMount = this.componentDidMount.bind(this);
    this.previewImage = this.previewImage.bind(this);
  }
  // todo: category based search, based on gender, based on price, based on sales, based on brand
  state = {
    product: null,
    image: 0,
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
        console.log(response);
        const { statusCode, value } = response;
        if (statusCode === 200) {
          this.setState({ product: value });
        }
      });
  }
  previewImage(val) {
    this.setState({image: val});
  }
  render() {
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
                              <img className="move-iamges" onMouseOver={() => {this.previewImage(j)}} width="100%" height="auto" src={i}></img>
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
                      {this.state.product.gender === "male" ? "Men's" : "Women's"}
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
                    <hr style={{ visibility: "hidden", height: "20px" }}></hr>
                    {this.state.product.avalibleSize[0] != null ? (
                        <>
                        
                        {this.state.product.avalibleSize[0].split(",").length >
                    0 ? (
                      <>
                        <div className="classic-label view-product-label">
                          Select Size
                        </div>
                        <hr
                          style={{ visibility: "hidden", height: "20px" }}
                        ></hr>
                        <div
                          id="select-product-size"
                          className="grid-container-size"
                        >
                          {this.state.product.avalibleSize[0]
                            .split(",")
                            .map((l, m) => {
                              return (
                                <div key={l + Math.random(0, 1000)}>
                                  <div className="grid-sizes">
                                    <div style={{ marginTop: "15px" }}>{l}</div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    ) : null}
                        </>
                    ) : null}
                    <button
                      className="button-28 view-product-label"
                      id="add-to-cart"
                    >
                      Add to cart
                    </button>
                    <hr style={{ visibility: "hidden", height: "20px" }}></hr>
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
                      <br />
                      {this.state.product.description}
                      <br />
                      <div
                        className="roboto-condensed-light"
                        style={{ textAlign: "left" }}
                      >
                        Delivery
                      </div>{" "}
                      All purchases are subject to delivery fees (4–10) business days
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
