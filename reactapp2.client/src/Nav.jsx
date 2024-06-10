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
  }, []);
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
                <div id="computer-nav">
                  <center>
                    <div id="bottom-category">
                      {category !== null ? (
                        <>
                          {category.map(function (i, j) {
                            return (
                              <div className="nav-div-labels" key={Math.random(0, 1000) + i.id}>
                                <div
                                  style={{ marginTop: "15px" }}
                                  className="bottom-category-labels"
                                  key={i.id + Math.random(0, 1)}
                                  onClick={() => {
                                    window.location.href = `/in?vwe=${i.id}`;
                                  }}>
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
              </nav>
            </>
          );
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default Nav;
