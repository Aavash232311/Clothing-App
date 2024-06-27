import React from "react";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { PiBagLight } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import Badge from "@mui/material/Badge";
import logo from "./static/images/logo.png";
import AuthContext, { AuthProvider } from "./authentication/auth";
import { useCart } from "./Admin/public/cartContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import "./static/nav.css";

function Nav() {
  const [category, setCategory] = React.useState(null);
  const [showMobileNav, setShowMobileNav] = React.useState(false);
  React.useEffect(() => {
    fetch("staff/getHomePageCategory", {
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
          const { value } = response;
          setCategory(value);
        }
      });
    const bottomNav = document.querySelector("#bottom-nav");
    const cart = document.querySelector("#cart-items-shortcut");
    window.addEventListener("scroll", () => {
      if (bottomNav !== null && window.scrollY >= 50) {
        bottomNav.style.position = "fixed";
        bottomNav.style.top = "0";
        bottomNav.style.marginTop = "-0px";
        bottomNav.style.zIndex = "99999999999999999999";
        if (cart != null) {
          cart.style.top = "50px";
        }
      } else {
        bottomNav.style.position = "relative";
        bottomNav.style.marginTop = "40px";
        if (cart != null) {
          cart.style.top = "85px";
        }
      }
    });
  }, []);
  const toggleMobileNav = () => {
    if (showMobileNav === true) {
      setShowMobileNav(false);
    } else {
      setShowMobileNav(true);
    }
  };
  const { items, deleteCart, list, setList } = useCart();

  let length = 0;
  if (items.length > 0) {
    for (let i = 0; i <= items.length - 1; i++) {
      length += items[i].quantity;
    }
  }
  return (
    <>
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            return (
              <>
                <nav id="upper-nav">
                  <div id="upper-nav-options">
                    <div className="upper-nav-label .upper-nav-font">
                      <NavItem>
                        <NavLink
                          className="upper-nav-font"
                          tag={Link}
                          to="/user-login"
                        >
                          Join Us
                        </NavLink>
                      </NavItem>
                    </div>
                    <div className="upper-nav-label">
                      <NavItem>
                        <NavLink
                          className="upper-nav-font"
                          tag={Link}
                          to="/user-login"
                        >
                          Sign In
                        </NavLink>
                      </NavItem>
                    </div>
                    <div className="upper-nav-label .upper-nav-font">
                      <NavItem>
                        <NavLink
                          className="upper-nav-font"
                          tag={Link}
                          to="/user-login"
                        >
                          Help
                        </NavLink>
                      </NavItem>
                    </div>
                    <div
                      style={{ borderRight: "none" }}
                      className="upper-nav-label .upper-nav-font"
                    >
                      <NavItem>
                        <NavLink
                          className="upper-nav-font"
                          tag={Link}
                          to="/user-login"
                        >
                          Find Store
                        </NavLink>
                      </NavItem>
                    </div>
                  </div>
                </nav>
                <nav id="bottom-nav" style={{ listStyle: "none" }}>
                  <NavItem>
                    <NavLink tag={Link} to="/">
                      <div id="bottom-nav-left">
                        <img
                          id="logo"
                          height="50"
                          width="100%"
                          src={logo}
                        ></img>
                      </div>
                    </NavLink>
                  </NavItem>
                  <div id="mobile-nav">
                    <svg
                      id="stack-icon-nav"
                      onClick={toggleMobileNav}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-three-dots"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                    </svg>
                  </div>
                  <div id="computer-nav" style={{ zIndex: "99999999999" }}>
                    <center>
                      <div id="bottom-category">
                        {category !== null ? (
                          <>
                            {category.map(function (i, j) {
                              return (
                                <div
                                  className="nav-div-labels"
                                  key={Math.random(0, 1000) + i.id}
                                >
                                  <div
                                    className="bottom-category-labels"
                                    onClick={() => {
                                      window.location.href = `/in?k=${i.id}`;
                                    }}
                                    style={{ marginTop: "15px" }}
                                  >
                                    {i.productCategory}
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        ) : null}
                      </div>
                    </center>
                    <div id="bottom-nav-right">
                      <div id="input-frame">
                        <div id="search-icon-icon">
                          <FaSearch
                            id="search-i"
                            style={{ marginLeft: "5px", marginTop: "-10px" }}
                          />
                        </div>
                        <div>
                          <input id="search" placeholder="search" />
                        </div>
                      </div>
                      <div>
                        <CiHeart className="botton-nav-icons" />
                      </div>
                      <div>
                        <NavItem>
                          <NavLink tag={Link} to={"/chittychittybangbang"}>
                            {items.length > 0 ? (
                              <div
                                style={{
                                  justifyContent: "right",
                                  float: "right",
                                }}
                              >
                                <Badge
                                  badgeContent={length}
                                  color="secondary"
                                  overlap="circular"
                                >
                                  <PiBagLight className="botton-nav-icons" />
                                </Badge>
                              </div>
                            ) : (
                              <PiBagLight className="botton-nav-icons" />
                            )}
                          </NavLink>
                        </NavItem>
                      </div>
                    </div>
                  </div>
                  {list === true && items.length > 0 ? (
                    <>
                      <div id="cart-items-shortcut">
                        <div style={{ justifyContent: "left" }}>
                          <br />
                          <center>
                            <h5 className="classic-label">
                              items
                              <div
                                style={{ float: "right", marginRight: "10px" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-x"
                                  viewBox="0 0 16 16"
                                  onClick={() => {
                                    setList(false);
                                  }}
                                >
                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                              </div>
                            </h5>
                          </center>
                        </div>
                        <hr />
                        <TableContainer component={Paper}>
                          <Table
                            sx={{
                              width: "95%",
                            }}
                            size="small"
                            aria-label="product and quantity"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell align="left">product</TableCell>
                                <TableCell align="left">image</TableCell>
                                <TableCell align="left">qty</TableCell>
                                <TableCell align="left">del</TableCell>
                                <TableCell align="left">size</TableCell>
                              </TableRow>
                            </TableHead>
                            {items.map((i, j) => {
                              const { p } = i;
                              return (
                                <TableBody key={Math.random(1, 100) + j}>
                                  <TableRow
                                    key={""}
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    <TableCell component="th" scope="row">
                                      {p.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      <img
                                        src={p.images[0]}
                                        width="50px"
                                        height="50px"
                                      ></img>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      {i.quantity}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      <DeleteOutlinedIcon
                                        onClick={() => {
                                          deleteCart(p.id);
                                        }}
                                        className="nav-cart-del"
                                      />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      {i.size}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              );
                            })}
                          </Table>
                        </TableContainer>
                        <hr style={{ visibility: "hidden" }} />
                        <center>
                          <NavItem>
                            <NavLink tag={Link} to="/chittychittybangbang">
                              <button className="button-28" id="checkout-nav">
                                Checkout
                              </button>
                            </NavLink>
                          </NavItem>
                        </center>
                        <hr style={{ visibility: "hidden" }} />
                      </div>
                    </>
                  ) : null}
                  {showMobileNav === true ? (
                    <>
                      <div id="mobile-nav-stack">
                        <br />
                        <center>Our products</center>
                        <hr style={{ width: "90%" }} />
                        {category !== null ? (
                          <>
                            {category.map(function (i, j) {
                              return (
                                <div key={j * Math.random(0, 100)}>
                                  <NavItem>
                                    <NavLink
                                      className="mob-cat classic-label"
                                      tag={Link}
                                      to={`/in?vwe=${i.id}`}
                                    >
                                      {i.productCategory}
                                    </NavLink>
                                  </NavItem>
                                  <br />
                                </div>
                              );
                            })}
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </nav>
              </>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    </>
  );
}

export default Nav;
