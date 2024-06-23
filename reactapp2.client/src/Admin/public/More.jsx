import React, { Component } from "react";
import "../../static/more.css";
import Nav from "../../Nav";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";

class Items extends Component {
  constructor(props) {
    super(props);
    this.payload = this.props.payload;
  }
  state = {};

  render() {
    return (
      <div style={{ overflow: "auto" }}>
        <div id="container-product-options">
          {this.props.products.value.map((i, j) => {
            let l = i;
            return (
              <div className="product-height" key={Math.random(0, 1000) + i.id}>
                <NavItem>
                  <NavLink tag={Link} to={`/view?key=${l.id}`}>
                    <div className="item-options">
                      <img
                        width="95%"
                        className="product-image"
                        src={l.images[0]}
                      ></img>
                      <hr style={{ visibility: "hidden" }}></hr>
                      <div className="product-cart-label-name">{l.name}</div>
                      <hr style={{ visibility: "hidden" }}></hr>
                      <div className="product-cart-label-name">
                        Rs: {l.price}
                      </div>
                    </div>
                  </NavLink>
                </NavItem>
              </div>
            );
          })}
        </div>
      </div>
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
      id: this.searchParams.get("k"),
      slowFilter: window.innerWidth <= 920 ? false : true,
      sales: false,
      price: false,
      recentlyAdded: false,
      priceOptions: "",
      recent: false,
      orginalProduct: null,
      gender: false,
      showFilterIcons: false,
    };
    this.setDropDown = this.setDropDown.bind(this);
    this.SortByGender = this.SortByGender.bind(this);
    this.SortByPrice = this.SortByPrice.bind(this);
    this.getIterableDataProductRender =
      this.getIterableDataProductRender.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.FilterToggle = this.FilterToggle.bind(this);
  }
  // in this case there was NO possible way i could figure out the problem
  // related to page not updating based on url paramaters (in case of same url different params) so the thing was
  // least documented and the possible reason i found is
  // to use the context api, add event to <NavLink> tag
  // on that chage in event we will re-render the data

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
          this.setState({ products: value, orginalProduct: value });
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
    this.fetchInitialData();
  }

  setDropDown(value) {
    // re-render all we don-t want the combied logic mess
    const arr = ["sales", "price", "recentlyAdded", "gender"]; // all state name that represents a dropdown
    arr.map((i) => {
      if (i !== value) {
        this.setState({ [i]: false });
      }
    });
    if (this.state[value] === true) {
      this.setState({ [value]: false });
      return;
    }
    this.setState({ [value]: true });
  }
  bubbleSort(arr, cd, compare) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        let c1, c2;
        if (cd === "date") {
          // we want to fist convert into readable javascript date
          c1 = new Date(arr[j][compare]).getTime();
          c2 = new Date(arr[j + 1][compare]).getTime();
        } else {
          c1 = arr[j][compare];
          c2 = arr[j + 1][compare];
        }
        if (c1 > c2) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    if (cd === "date") return arr;
    if (cd === "-ve") {
      let temp = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        temp.push(arr[i]);
      }
      return temp;
    }
    return arr;
  }

  SortByPrice(ev) {
    const { value } = ev.target;
    let { PAGE, ORIGIN, FILTER_PRODUCT } = this.getIterableDataProductRender();
    this.setState({ priceOptions: value, SortByGender: "all" });
    if (value === "lowToHigh") {
      FILTER_PRODUCT = this.bubbleSort(ORIGIN, "+ve", "price"); // because we might want to filter among other selected category
    } else if (value === "highToLow") {
      FILTER_PRODUCT = this.bubbleSort(ORIGIN, "-ve", "price");
    }
    this.setState({ products: { value: FILTER_PRODUCT, page: PAGE } });
  }

  getIterableDataProductRender() {
    let PAGE = this.state["orginalProduct"]["page"];
    let ORIGIN = this.state["orginalProduct"]["value"];
    let FILTER_PRODUCT = [...this.state["orginalProduct"]["value"]];
    return {
      PAGE: PAGE,
      ORIGIN: ORIGIN,
      FILTER_PRODUCT: FILTER_PRODUCT,
    };
  }
  SortByGender(ev) {
    const { value } = ev.target;
    let { PAGE, ORIGIN, FILTER_PRODUCT } = this.getIterableDataProductRender();
    if (value === "all") {
      FILTER_PRODUCT = ORIGIN.filter((x) => true);
    } else {
      FILTER_PRODUCT = ORIGIN.filter((x) => x.gender === value);
    }
    this.setState({ products: { value: FILTER_PRODUCT, page: PAGE } });
  }

  sortByDate(ev) {
    const { checked } = ev.target;
    let { PAGE, ORIGIN, FILTER_PRODUCT } = this.getIterableDataProductRender();
    let sortOnTheBasisOfDate;
    if (checked === true) {
      sortOnTheBasisOfDate = this.bubbleSort(FILTER_PRODUCT, "date", "added"); // by default the server returns on the basis of sorted data
      // but when we filter on the basis of gender let's say it sorts recently added
    } else {
      sortOnTheBasisOfDate = ORIGIN;
    }
    this.setState({ products: { value: sortOnTheBasisOfDate, page: PAGE } });
  }

  FilterToggle() {
    const bool = this.state.slowFilter;
    if (bool === true) {
      this.setState({ slowFilter: false });
    } else {
      this.setState({ slowFilter: true });
    }
  }

  render() {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 920) {
        this.setState({ slowFilter: true });
      }
    });
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
                  onClick={this.FilterToggle}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  id="filter-options-icons"
                >
                  <div id="filter-icon-right">
                    <div id="filter-icon">
                      Filter
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
                </div>
              </div>
              <div id="frame-div">
                <div id="filter-frame-p">
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
                              <FormControl style={{ width: "90%" }}>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="sel-gender"
                                  label="Gender"
                                  onChange={this.SortByGender}
                                  defaultValue={"all"}
                                >
                                  <MenuItem value="Male">male</MenuItem>
                                  <MenuItem value="Female">female</MenuItem>
                                  <MenuItem value="all">unisex</MenuItem>
                                </Select>
                              </FormControl>
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
                            <br />
                            <div className="options-dropdown">
                              <FormControl style={{ width: "90%" }}>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="sel-price"
                                  label="Price"
                                  onChange={this.SortByPrice}
                                  defaultValue={"all"}
                                >
                                  <MenuItem value="highToLow">
                                    high to low
                                  </MenuItem>
                                  <MenuItem value="lowToHigh">
                                    low to high
                                  </MenuItem>
                                  <MenuItem value="all">all</MenuItem>
                                </Select>
                              </FormControl>
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
                          </div>
                        </center>
                        <hr style={{ visibility: "hidden", height: "50px" }} />
                        {this.state.recentlyAdded === true ? (
                          <>
                            <div className="options-dropdown">
                              <FormGroup style={{ float: "left" }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(ev) => {
                                        this.sortByDate(ev);
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
