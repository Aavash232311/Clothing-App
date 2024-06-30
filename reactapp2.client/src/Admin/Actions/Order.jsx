import React, { Component } from "react";
import Services from "../../utils/utils";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "../../static/order.css";
// I could use google api for location but too bored for that
const RupeeseIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-currency-rupee"
        viewBox="0 0 16 16"
      >
        <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
      </svg>
    </>
  );
};

class Order extends Component {
  state = {
    page: 1, // actual page calulcated from the server (limiting page)
    orders: null,
    dialog: null,
    filter: "not verified",
    search: null,
    currentPage: 1,
  };
  constructor(props) {
    super(props);
    this.services = new Services();
    this.updateStauts = this.updateStauts.bind(this);
    this.fetchInitial = this.fetchInitial.bind(this);
    this.update = this.update.bind(this);
    this.makeSearch = this.makeSearch.bind(this);
    this.rangeChange = this.rangeChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  update(ev) {
    const { name, value } = ev.target;
    if (name === "search" && value === '') {
      this.setState({filter: "not verified", currentPage: 1}, () => {
        this.fetchInitial();
      })
    }
    this.setState({ [name]: value });
  }
  updateStauts(ev, id) {
    const { value } = ev.target;
    fetch(`staff/order-status?status=${value}&&id=${id}`, {
      // thing of concern
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.services.getToken()}`,
      },
    })
      .then((r) => {
        return r.json();
      })
      .then((response) => {
        const { statusCode } = response;
        if (statusCode != 200) {
          alert("Something went wrong");
          return;
        }
        if (statusCode === 200) {
          ev.target.value = value;
          this.fetchInitial(); // re-render with same paramater
        }
      });
  }
  componentDidMount() {
    // I dont want to make it complex by using web sockets so ill do long poling
    this.fetchInitial();
    setInterval(() => {
      this.fetchInitial();
    }, 600000);
  }
  fetchInitial() {
    fetch(
      `staff/load-orders?page=${this.state.currentPage}&&filter=${this.state.filter}`,
      {
        // thing of concern
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.services.getToken()}`,
        },
      }
    )
      .then((r) => {
        return r.json();
      })
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode !== 200) {
          alert("Something went wrong");
          return;
        }
        let { page, orders } = value;
        if (orders.length === 0) {
          this.setState({ orders: null });
          return;
        }
        this.setState({ page, orders });
      });
  }

  makeSearch(ev) {
    ev.preventDefault();
    const { search } = this.state;;
    fetch(`public/order-by-id?id=${search}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.services.getToken()}`,
      },
    })
      .then((r) => {
        return r.json();
      })
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode != 200) {
          alert("Someting went wrong!");
          return;
        }
        this.setState({ orders: [value] });
      });
  }
  rangeChange(cd) {
    let range = this.state.currentPage;
    if (cd === "-ve") {
      if (range - 1 !== 0) {
        range -= 1;
      }
    } else {
      if (range + 1 <= this.state.page) {
        range += 1;
      }
    }
    this.setState({ currentPage: range }, () => {
      this.fetchInitial();
    });
  }
  render() {
    return (
      <div id="order-frame">
        <br />
        <h5 className="classic-label">Filter Orders by</h5>
        <form onSubmit={this.makeSearch}>
          <div id="filter-grid">
            <div>
              <input
                name="search"
                onInput={this.update}
                style={{ width: "100%" }}
                className="form-control"
                placeholder="id (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
                required={true}
                autoComplete="off"
              ></input>
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                search
              </button>
            </div>
            <div>
              <select
                name="filter"
                onInput={(ev) => {
                  this.setState({ filter: ev.target.value }, () => {
                    this.setState({ currentPage: 1 }, () => {
                      this.fetchInitial();
                    });
                  });
                }}
                defaultValue={this.state.filter}
                className="form-control"
              >
                <option value="not verified">not verified</option>
                <option value="completed">completed</option>
                <option value="set to delivery">set to delivery</option>
                <option value="cancel">cancel</option>
              </select>
            </div>
          </div>
        </form>
        {this.state.dialog != null ? (
          <>
            <center>
              <dialog open id="view-product">
                <div
                  style={{
                    textAlign: "right",
                    padding: "5px",
                    userSelect: "none",
                    width: "100%",
                  }}
                  onClick={() => {
                    this.setState({ dialog: null });
                  }}
                >
                  x
                </div>
                <table className="table">
                  <caption>List of user ordered products</caption>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Link</th>
                      <th scope="col">image</th>
                      <th scope="col">Name</th>
                      <th scope="col">Size</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dialog.map((i, j) => {
                      const { product } = i;
                      return (
                        <tr key={i.id}>
                          <th scope="row">{j + 1}</th>
                          <th>
                            <div
                              className="view-ordered-products"
                              style={{ listStyle: "none" }}
                            >
                              <div
                                onClick={() => {
                                  window.open(
                                    `/view?key=${product.id}`,
                                    "_blank"
                                  );
                                }}
                              >
                                product link
                              </div>
                            </div>
                          </th>
                          <td>
                            <img
                              height="25"
                              width="25"
                              src={product.images[0]}
                            ></img>
                          </td>
                          <td>{product.name}</td>
                          <td>{i.size}</td>
                          <td>{i.qty}</td>
                          <td>
                            {" "}
                            <RupeeseIcon />
                            {i.totalPrice}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </dialog>
            </center>
          </>
        ) : null}
        {this.state.orders !== null ? (
          <table className="table table-striped">
            <caption>
              Orders:
              {this.state.page > 1 ? (
                <>
                  Page: {this.state.currentPage}
                  <div id="next-button-gird">
                    <div>
                      <div
                        onClick={() => {
                          this.rangeChange("-ve");
                        }}
                        className="next"
                      >
                        <KeyboardArrowLeftIcon />
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={() => {
                          this.rangeChange("+ve");
                        }}
                        className="next"
                      >
                        <ChevronRightIcon />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Copy Id</th>
                <th scope="col">Email</th>
                <th scope="col">address</th>
                <th scope="col">province</th>
                <th scope="col">street</th>
                <th scope="col">zip code</th>
                <th scope="col">Email</th>
                <th scope="col">Products</th>
                <th scope="col">Checkout date</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {this.state.orders.map((i, j) => {
                const { user, products } = i;
                return (
                  <tr key={j}>
                    <th scope="row">{j + 1}</th>
                    <td
                      className="view-ordered-products"
                      onClick={() => {
                        navigator.clipboard.writeText(i.id);
                        alert("Copid!");
                      }}
                    >
                      copy..
                    </td>
                    <td>{user.email}</td>
                    <td>{i.address}</td>
                    <td>{i.province}</td>
                    <td>{i.street}</td>
                    <td>{i.zipCode}</td>
                    <td>{i.phoneNumber}</td>
                    <td style={{ cursor: "pointer" }}>
                      <div
                        onClick={() => {
                          this.setState({ dialog: products });
                        }}
                        className="view-ordered-products"
                      >
                        view
                      </div>
                    </td>
                    <td>{this.services.date(i.checkOutDate)}</td>
                    <td>
                      <RupeeseIcon /> {i.netTotalAmount}
                    </td>
                    <td>
                      <div className="input-group mb-3">
                        <select
                          className="form-control"
                          value={this.state.filter}
                          onInput={(ev) => {
                            this.updateStauts(ev, i.id);
                          }}
                        >
                          <option value="not verified">not verified</option>
                          <option value="completed">completed</option>
                          <option value="set to delivery">
                            set to delivery
                          </option>
                          <option value="cancel">cancel</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <>
            <hr style={{ visibility: "hidden" }}></hr>
            <center>
              <h3>No Orders</h3>
              <br />
            </center>
          </>
        )}
      </div>
    );
  }
}

export default Order;
