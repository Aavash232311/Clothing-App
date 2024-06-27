import React from "react";
import logo from "../static/images/logo.png";
import { CiBellOn } from "react-icons/ci";
import { TbMoneybag } from "react-icons/tb";
import Category from "./Actions/Category";
import Degisn from "./Actions/Degisn";
import Product from "./Actions/Product";
import Shipping from "./Actions/Shipping";
import "../static/admin.css";

const navContent = [
  {
    title: "Product",
  },
  {
    title: "Order",
  },
  {
    title: "Category map",
  },
  {
    title: "page design",
  },
  {
    title: "Stock",
  },
  {
    title: "Shipping",
  },
  {
    title: "Users",
  },
  {
    title: "Analysis",
  },
  {
    title: "Surf",
  },
];

const SideNav = (props) => {
  return (
    <div id="side-nav">
      <center>
        <br />
        <h5 id="nav-theme-admin">ADMIN</h5>
      </center>
      <br />
      {navContent.map((i, j) => {
        return (
          <React.Fragment key={j}>
            <div
              onClick={() => {
                props.render(i);
              }}
              className="side-labels"
              style={{ userSelect: "none" }}
            >
              <div className="label-text">{i.title}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

function AdminDashboard() {
  const [render, setRender] = React.useState(null);
  const renderFunction = (obj) => {
    const { title } = obj;
    setRender(title);
  };

  const CompoenetFunction = () => {
    switch (render) {
      case "Category map":
        return <Category />;
      case "page design":
        return <Degisn />;
      case "Product":
        return <Product />;
      case "Shipping":
        return <Shipping />;
    }
  };

  // cateory name input
  // cateory search (which returns a guid value based on the name searched)
  // category child search again the same thing
  return (
    <div className="admin-dashboard">
      <div id="admin-nav">
        <img
          style={{ marginLeft: "10px" }}
          id="logo"
          height="50"
          width="200"
          src={logo}
        ></img>
        <div id="admin-nav-right">
          <div>
            <TbMoneybag style={{ fontSize: "28px", marginTop: "10px" }} />
          </div>
          <div className="middle-div">
            <CiBellOn style={{ fontSize: "28px", marginTop: "10px" }} />
          </div>
          <div>
            <div id="profile"></div>
          </div>
        </div>
      </div>
      <div id="admin-structure-placer">
        <div>
          <SideNav render={renderFunction} />
        </div>

        <div id="playground">
          {render != null ? <CompoenetFunction /> : null}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
