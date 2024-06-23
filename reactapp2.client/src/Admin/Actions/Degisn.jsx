import React, { Component } from "react";
import "../../static/design.css";
import { IoIosAdd } from "react-icons/io";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
// todo: assign auth header for all fetch request
// todo: in category page until and unless the user refreshes dont fetch new result

class AddProcutToTheme extends Component {
  constructor(props) {
    super(props);
    this.searchResults = this.searchResults.bind(this);
    this.update = this.update.bind(this);
    this.addToProductArray = this.addToProductArray.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.deleteThemeProduct = this.deleteThemeProduct.bind(this);
    this.loadThemedProduct = this.loadThemedProduct.bind(this);
  }

  state = {
    searchResult: null,
    productArray: [],
  };

  update(ev) {
    const { value, name } = ev.target;
    this.setState({ [name]: value });
  }

  searchResults() {
    fetch(`staff/get-procuts?name=${this.state.query}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((reponse) => {
        const { statusCode, value } = reponse;
        if (statusCode === 200) {
          this.setState({ searchResult: value });
        }
      });
  }
  

  loadThemedProduct() {
    // load added products to the theme
    fetch(`staff/get-temed-product?themeId=${this.props.id}`, {
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
          const { products } = value;
          this.setState({ productArray: products });
        }
      });
  }

  componentDidMount() {
    this.loadThemedProduct();
  }

  deleteThemeProduct(productId) {
    fetch(
      `/staff/delete-theme-product?themeId=${this.props.id}&productId=${productId}`,
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
        const { statusCode } = response;
        console.log(response);
        if (statusCode === 200) {
          this.loadThemedProduct();
        }
      });
  }

  addToProductArray(item) {
    // make the fetch call to server on success add to array
    const productID = item.id; // product id
    const themeID = this.props.id;
    fetch(`staff/add-theme-product?themeId=${themeID}&productId=${productID}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          const curr = [...this.state.productArray];
          const check = curr.find((x) => x.id === item.id);
          if (check === undefined) {
            this.setState((prevState) => ({
              productArray: [...prevState.productArray, item],
            }));
          }
        }
      });
  }

  render() {
    return (
      <dialog id="add-theme-products" open>
        <div style={{ display: "grid", gridTemplateColumns: "70% 20% 10%" }}>
          <div>
            <input
              className="classic-input"
              style={{ width: "100%" }}
              name="query"
              onInput={this.update}
              placeholder="search product"
              autoComplete="off"
            ></input>
          </div>
          <div>
            <button onClick={this.searchResults} className="classic-button">
              search
            </button>
          </div>
          <div
            onClick={() => {
              this.props.abort();
            }}
            style={{
              marginTop: "18%",
              cursor: "pointer",
              userSelect: "none",
              float: "right",
            }}
          >
            x
          </div>
        </div>
        <hr />
        {this.state.productArray.length > 0 ? (
          <>
            <div className="grid-container">
              {this.state.productArray.map((i, j) => {
                return (
                  <div key={i.id + Math.random(0, 10000)}>
                    <img
                      className="selected-images"
                      height="80"
                      width="80"
                      src={i.images}
                    ></img>{" "}
                    <DeleteOutlineRoundedIcon
                      onClick={() => {
                        this.deleteThemeProduct(i.id);
                      }}
                      className="image-del-icn"
                    />
                    <br />
                    <div>
                      <center>{i.name}</center>
                    </div>
                  </div>
                );
              })}
            </div>
            <hr />
          </>
        ) : null}
        <div>
          {this.state.searchResult != null ? (
            <div>
              <div style={{ fontWeight: "lighter", textAlign: "left" }}>
                Results
              </div>
              <hr />
              {this.state.searchResult.map((i, j) => {
                return (
                  <div key={j} className="cross-feed">
                    <div style={{ width: "100%", textAlign: "left" }}>
                      {i.name}{" "}
                      <div
                        onClick={() => {
                          this.addToProductArray(i);
                        }}
                        className="cross-icon"
                      >
                        +
                      </div>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </dialog>
    );
  }
}

class AddSlotImages extends Component {
  state = {
    slots: null,
    image: null,
    tweak: null,
    themeProducts: null,
  };
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.send = this.send.bind(this);
    this.update = this.update.bind(this);
    this.loadinit = this.loadinit.bind(this);
    this.deleteSlots = this.deleteSlots.bind(this);
    this.updateSlots = this.updateSlots.bind(this);
    this.cancelAddThemePorudct = this.cancelAddThemePorudct.bind(this);
  }

  cancelAddThemePorudct() {
    this.setState({ themeProducts: null });
  }

  loadinit() {
    fetch("/staff/getSlotsHomePage", {
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
          this.setState({ slots: value });
        }
      });
  }
  componentDidMount() {
    this.loadinit();
  }

  update(ev) {
    const { name, value, type } = ev.target;
    console.log(name);
    this.setState({ [name]: type === "file" ? ev.target.files[0] : value });
  }
  send(ev) {
    ev.preventDefault();
    const formData = new FormData();
    Object.entries(this.state).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fetch("/staff/saveSlotsHomePage", {
      method: "post",
      credentials: "include",
      body: formData,
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.loadinit();
          ev.target.reset();
        }
      });
  }

  deleteSlots(id) {
    fetch(`/staff/deleteSlots?id=${parseInt(id)}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.loadinit();
        }
      });
  }
  updateSlots(ev) {
    ev.preventDefault();

    const formData = new FormData();
    Object.entries(this.state).forEach(([key, value]) => {
      if (key !== "tweak" && value !== null) {
        formData.append(key, value);
      }
    });
    fetch(`/staff/updateSlotsHomePage/${this.state.tweak.id}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((rsp) => {
        if (!rsp.ok) {
          return rsp.json().then((err) => {
            throw new Error(JSON.stringify(err));
          });
        }
        return rsp.json();
      })
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.setState({ tweak: null });
          this.loadinit();
        }
      });
  }

  render() {
    return (
      <div>
        <div className="admin-labels">home page (slot design)</div>
        <form onSubmit={this.send}>
          <input
            className="classic-input slot-home-page"
            placeholder="title.."
            name="name"
            onInput={this.update}
            autoComplete="off"
            required
          />
          <input
            className="classic-input slot-home-page"
            placeholder="theme.."
            name="theme"
            onInput={this.update}
            autoComplete="off"
            required
          />
          <input
            className="classic-input slot-home-page"
            placeholder="link.."
            name="link"
            onInput={this.update}
            autoComplete="off"
            required
          />
          <div className="slot-home-page">
            <input
              className="form-control slot-home-page "
              type="file"
              placeholder="theme.."
              onInput={this.update}
              name="image"
              required
            />
          </div>
          <button
            type="submit"
            className="slot-home-page btn btn-outline-primary"
          >
            send..
          </button>
        </form>
        <hr style={{ visibility: "hiddern" }} />
        {this.state.slots != null ? (
          <>
            <TableContainer
              sx={{ width: "90%", float: "left", m: 1 }}
              component={Paper}
            >
              <Table
                sx={{ width: "100%" }}
                key={"new"}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>(SN)</TableCell>
                    <TableCell align="right">Title</TableCell>
                    <TableCell align="right">Theme</TableCell>
                    <TableCell align="right">link</TableCell>
                    <TableCell align="right">poster</TableCell>
                    <TableCell align="right">theme products</TableCell>
                    <TableCell align="right">delete</TableCell>
                    <TableCell align="right">edit</TableCell>
                  </TableRow>
                </TableHead>
                {this.state.slots.map((i, j) => {
                  return (
                    <TableBody key={i.id}>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {j}
                        </TableCell>
                        <TableCell align="right">{i.name}</TableCell>
                        <TableCell align="right">{i.theme}</TableCell>
                        <TableCell
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            navigator.clipboard.writeText(i.link);
                          }}
                          align="right"
                        >
                          {i.link.substring(0, 10)}
                        </TableCell>
                        <TableCell align="right">
                          <img height="50" width="50" src={i.image}></img>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              this.setState({ themeProducts: i.id });
                            }}
                          >
                            Add +
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => {
                              this.deleteSlots(i.id);
                            }}
                          >
                            Del
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            onClick={() => {
                              this.setState({
                                tweak: i,
                                name: i.name,
                                theme: i.theme,
                                link: i.link,
                              });
                            }}
                            variant="outlined"
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
              </Table>
            </TableContainer>
          </>
        ) : null}
        {this.state.themeProducts !== null ? (
          <AddProcutToTheme
            abort={this.cancelAddThemePorudct}
            id={this.state.themeProducts}
          />
        ) : null}
        {this.state.tweak != null ? (
          <div id="edit-slot-dialogue">
            <form>
              <input
                className="classic-input slot-home-page"
                placeholder="title.."
                name="name"
                autoComplete="off"
                defaultValue={this.state.tweak.name}
                onInput={this.update}
                required
              />
              <input
                className="classic-input slot-home-page"
                placeholder="theme.."
                name="theme"
                autoComplete="off"
                defaultValue={this.state.tweak.theme}
                onInput={this.update}
                required
              />
              <input
                className="classic-input slot-home-page"
                placeholder="link.."
                name="link"
                autoComplete="off"
                defaultValue={this.state.tweak.link}
                onInput={this.update}
                required
              />
              <div className="slot-home-page">
                <span
                  style={{ float: "left", cursor: "pointer" }}
                  onClick={() => {
                    window.open(this.state.tweak.image, "_blank");
                  }}
                >
                  view image?
                </span>
                <input
                  className="form-control slot-home-page "
                  type="file"
                  placeholder="theme.."
                  name="image"
                  onInput={this.update}
                  required
                />
              </div>
              <button
                type="submit"
                className="slot-home-page btn btn-outline-primary"
                onClick={this.updateSlots}
              >
                Done
              </button>
            </form>
          </div>
        ) : null}
      </div>
    );
  }
}

export default class Degisn extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.search = this.search.bind(this);
    this.mark = this.mark.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadInitial = this.loadInitial.bind(this);
  }
  state = {
    search: null,
    searchItem: null,
    selected: null,
    initial: null,
  };
  loadInitial() {
    fetch("/staff/getHomePageCategory", {
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
          this.setState({ initial: value });
        } else {
          const { code } = response;
          if (code === 101) {
            alert("Category should be less than or equal to 5");
          }
        }
      });
  }
  componentDidMount() {
    this.loadInitial();
  }

  update(ev) {
    const { name, value } = ev.target;
    this.setState({ [name]: value });
  }

  search() {
    fetch(`/admin/searchCategory?query=${this.state.searchItem}`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { value, statusCode } = response;
        console.log(value);
        if (statusCode === 200) {
          const { result } = value;
          if (result != "") {
            this.setState({ search: result });
          }
        }
      });
  }
  mark(ev, id) {
    let checked = false;
    if (ev !== null) {
      const { c } = ev.target;
      checked = c;
    } else {
      checked = true;
    }
    fetch(
      `/staff/addHomePageCategory?id=${id}&action=${
        checked == true ? "checked" : "unchecked"
      }`,
      {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          this.loadInitial();
          this.setState({ search: null });
          alert("Changes were made");
        } else {
          const { error } = response;
          alert(error);
        }
      });
  }
  render() {
    return (
      <>
        <center>
          <div id="center-div">
            <div className="admin-labels">
              top listed category (appeares in the bottom nav bar only 5)
            </div>
            <hr style={{ visibility: "hidden", height: "20px" }}></hr>
            <div id="add-box">
              <div id="add-to-top-div">
                <div>
                  <input
                    placeholder="search.."
                    className="classic-input"
                    id="add-admin-input"
                    name="searchItem"
                    style={{
                      position: "relative",
                    }}
                    onInput={this.update}
                    autoComplete="off"
                  ></input>
                </div>
                <div>
                  <button
                    onClick={this.search}
                    className="classic-button"
                    id="add-top-category"
                  >
                    search
                  </button>
                </div>
              </div>
              {this.state.search !== null ? (
                <>
                  <div id="searchOptions">
                    {this.state.search.map((i, j) => {
                      return (
                        <div key={i.id} className="search-options-page0des">
                          {i.productCategory}
                          <div style={{ float: "right", marginRight: "5px" }}>
                            <IoIosAdd
                              onClick={() => {
                                this.mark(null, i.id);
                              }}
                            />
                          </div>
                          <hr />
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
              <div style={{ marginTop: "15px" }}>
                {this.state.initial !== null ? (
                  <>
                    {this.state.initial.map((i, j) => {
                      return (
                        <div className="categoryList" key={i.id}>
                          {i.productCategory}
                          <div style={{ float: "right" }}>
                            <input
                              onClick={(ev) => {
                                this.mark(ev, i.id);
                              }}
                              style={{ marginRight: "5px" }}
                              defaultChecked={true}
                              type="checkbox"
                            ></input>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : null}
              </div>
            </div>
            <div>
              <AddSlotImages />
            </div>
          </div>
        </center>
      </>
    );
  }
}
