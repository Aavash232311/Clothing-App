import "./App.css";
import Nav from "./Nav";
import React from "react";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";

function App() {
  const [slot, setSlot] = React.useState(null);
  React.useEffect(() => {
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
          setSlot(value);
        }
      });
  }, []);
  return (
    <div>
      <Nav />
      {/* {"lets iterate over themes"} */}
      {slot != null ? (
        <>
          {slot.map((i, j) => {
            const { products } = i;
            return (
              <div
                key={i.id + Math.random(0, 1000)}
                style={{ listStyle: "none" }}
              >
                <hr style={{ visibility: "hidden" }}></hr>
                <div>
                  <NavItem>
                    <NavLink tag={Link} to={i.link}>
                      <img height="auto" width="100%" src={i.image}></img>
                    </NavLink>
                  </NavItem>
                  <hr style={{ visibility: "hidden", height: "25px" }}></hr>
                  <center>
                    <div className="roboto-condensed">{i.name}</div>
                    <hr style={{ visibility: "hidden", height: "25px" }}></hr>
                    <div className="roboto-condensed-light">{i.theme}</div>{" "}
                    <hr style={{ visibility: "hidden" }} />
                    {products.length > 0 ? (
                      <div className="grid-containor-home-page">
                        {products.map((l, m) => {
                          return (
                            <div key={l.id + Math.random(10001, 2000)}>
                              <NavItem>
                                <NavLink tag={Link} to={`/view?key=${l.id}`}>
                                  <div className="product-cart">
                                    <img
                                      width="100%"
                                      height="350"
                                      src={l.images[0]}
                                    ></img>
                                    <hr style={{ visibility: "hidden" }}></hr>
                                    <div className="product-cart-label-name">
                                      {l.name}
                                    </div>
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
                    ) : null}
                  </center>
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

export default App;
