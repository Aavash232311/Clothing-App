import React, { Component } from "react";
import "../../static/more.css";
import Nav from "../../Nav";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

class Items extends Component {
  constructor(props) {
    super(props);
    this.payload = this.props.payload;
  }
  state = {};

  render() {
    return (
      <>
        <div className="container-product-options">
          {this.props.products.value.map((i, j) => {
            return (
              <div className="item-options" key={Math.random(0, 1000) + i.id}>
                {i.name}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

class More extends Component {
  constructor(props) {
    super(props);
    this.searchParams = new URLSearchParams(window.location.search);
    this.state = {
      page: 1,
      products: null,
      category: null,
      id: this.searchParams.get("vwe"),
      slowFilter: true,
      sales: false,
      price: false,
      recentlyAdded: false,
      male: false,
      female: false,
      all: true,
      lowToHigh: false,
      highToLow: false,
      priceAll: false,
      recent: false
    };
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.setDropDown = this.setDropDown.bind(this);
    this.filterByGender = this.filterByGender.bind(this);
  }

  fetchInitialData() {
    fetch(
      `/public/get-category-procuts?id=${this.state.id}&page=${this.state.page}`,
      {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((r) => r.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode === 200) {
          this.setState({ products: value });
        }
      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.id !== this.state.id) {
      this.fetchCategory();
      this.fetchProducts();
    }
  }

  componentDidMount() {
    fetch(`/public/get-category-by-id?id=${this.state.id}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode === 200) {
          this.setState({ category: value });
        }
      });
    this.fetchInitialData(); // Corrected method name
  }

  setDropDown(value) {
    if (this.state[value] === true) {
      this.setState({ [value]: false });
      return;
    }
    this.setState({ [value]: true });
  }

  filterByGender(ev, name) {
    const { checked } = ev.target;
    this.setState({ [name]: checked }, () => {});
  }

  render() {
    return (
      <div id="category-page-frame">
        <Nav /> <br />
        <div id="category-page-frame">
          {/* Other components */}
          {this.state.category != null && (
            <>
              <div id="category-products-labal">
                <h3
                  className="classic-label view-product-label"
                  id="page-label-category"
                >
                  {this.state.category.productCategory}
                </h3>
                <div
                  onClick={() => {
                    var grid = document.querySelector("#frame-div");
                    if (this.state.slowFilter === true) {
                      grid.style.gridTemplateColumns = "100%";
                      this.setState({ slowFilter: false });
                    } else {
                      grid.style.gridTemplateColumns = "10% 100%";
                      this.setState({ slowFilter: true });
                    }
                  }}
                  id="filter-options"
                  className="classic-label"
                >
                  Hide filter{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-filter-right"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5" />
                  </svg>
                </div>
              </div>
              <div id="frame-div">
                <div>
                  {this.state.slowFilter === true ? (
                    <>
                      <div id="filter-div">
                        <br />
                        <center>
                          <span
                            className="classic-label"
                            style={{ float: "left", marginLeft: "5px" }}
                          >
                            Sort By
                          </span>
                        </center>
                        <hr style={{ visibility: "hidden" }} />
                        <center>
                          <div
                            className="classic-label options-more"
                            style={{ float: "left" }}
                            onClick={() => {
                              this.setDropDown("gender");
                            }}
                          >
                            <div>Gender</div>
                            <div className="arrow-up-options">
                              {this.state.gender === false ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </div>
                          </div>
                        </center>
                        <hr style={{ visibility: "hidden", height: "50px" }} />
                        {this.state.gender === true ? (
                          <>
                            <div className="options-dropdown">
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(ev) => {
                                        this.filterByGender(ev, "male");
                                      }}
                                    />
                                  }
                                  label="male"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(ev) => {
                                        this.filterByGender(ev, "female");
                                      }}
                                    />
                                  }
                                  label="female"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(ev) => {
                                        this.filterByGender(ev, "all");
                                      }}
                                    />
                                  }
                                  checked
                                  label="all"
                                />
                              </FormGroup>
                            </div>
                          </>
                        ) : null}
                        <center>
                          <div
                            className="classic-label options-more"
                            style={{ float: "left" }}
                            onClick={() => {
                              this.setDropDown("sales");
                            }}
                          >
                            <div>Sales</div>
                            <div className="arrow-up-options">
                              {this.state.sales === false ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </div>
                          </div>
                        </center>
                        <hr style={{ visibility: "hidden", height: "50px" }} />
                        {this.state.sales === true ? (
                          <>
                            <div className="options-dropdown">
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(ev) => {
                                        this.filterByGender(ev, "sales");
                                      }}
                                    />
                                  }
                                  label="Sales"
                                />
                              </FormGroup>
                            </div>
                          </>
                        ) : null}
                        <center>
                          <div
                            className="classic-label options-more"
                            style={{ float: "left" }}
                            onClick={() => {
                              this.setDropDown("price");
                            }}
                          >
                            <div>Price</div>
                            <div className="arrow-up-options">
                              {this.state.price === false ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </div>
                          </div>
                        </center>
                        <hr style={{ visibility: "hidden", height: "50px" }} />
                        {this.state.price === true ? (
                          <>
                            <div className="options-dropdown">
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(ev) => {
                                        this.filterByGender(ev, "lowToHigh");
                                      }}
                                    />
                                  }
                                   label="low to high"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(ev) => {
                                        this.filterByGender(ev, "highToLow");
                                      }}
                                    />
                                  }
                                  label="High to low"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(ev) => {
                                        this.filterByGender(ev, "priceAll");
                                      }}
                                      checked
                                    />
                                  }
                                  label="all"
                                />
                              </FormGroup>
                            </div>
                          </>
                        ) : null}
                        <center>
                          <div
                            className="classic-label options-more"
                            style={{ float: "left" }}
                            onClick={() => {
                              this.setDropDown("recentlyAdded");
                            }}
                          >
                            <div>Recently added</div>
                            <div className="arrow-up-options">
                              {this.state.recentlyAdded === false ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </div>
                            {this.state.recentlyAdded === true ? (
                              <>
                                <div className="options-dropdown">
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={(ev) => {
                                            this.filterByGender(ev, "recent");
                                          }}
                                        />
                                      }
                                      label="recent"
                                    />
                                  </FormGroup>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </center>
                      </div>
                    </>
                  ) : null}
                </div>
                <div id="products-div">
                  {this.state.products != null ? (
                    <Items
                      products={this.state.products}
                      payload={this.state}
                    />
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default More;
