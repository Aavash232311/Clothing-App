import React from "react";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { PiBagLight } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import logo from "./static/images/logo.png";
import AuthContext, { AuthProvider } from "./authentication/auth";
import "./static/nav.css";

function Nav() {
  const [email, setEmail] = React.useState("");
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
    console.log(window.location.href);
    window.addEventListener("scroll", () => {
      if (bottomNav !== null && window.scrollY >= 50) {
        bottomNav.style.position = "fixed";
        bottomNav.style.top = "0";
        bottomNav.style.marginTop = "-0px";
      } else {
        bottomNav.style.position = "relative";
        bottomNav.style.marginTop = "40px";
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
  return (
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
                      <img id="logo" height="50" width="100%" src={logo}></img>
                    </div>
                  </NavLink>
                </NavItem>
                <div id="mobile-nav">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-stack"
                    viewBox="0 0 16 16"
                    id="stack-icon-nav"
                    onClick={toggleMobileNav}
                  >
                    <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z" />
                    <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z" />
                  </svg>
                </div>
                <div id="computer-nav">
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
                                  style={{ marginTop: "15px" }}
                                  className="bottom-category-labels"
                                  key={i.id + Math.random(0, 1)}
                                  onClick={() => {
                                    window.location.href = `/in?vwe=${i.id}`;
                                  }}
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
                      <PiBagLight className="botton-nav-icons" />
                    </div>
                  </div>
                </div>
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
                              <>
                                <div
                                  onClick={() => {window.location.href = `/in?vwe=${i.id}`;}}className="mob-cat classic-label">
                                  {i.productCategory}
                                </div>{" "}
                                <br />
                              </>
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
  );
}

export default Nav;
