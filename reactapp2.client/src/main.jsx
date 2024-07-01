import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./authentication/login.jsx";
import SignUp from "./authentication/signup.jsx";
import AdminDashboard from "./Admin/Admin.jsx";
import SignInSide from "./authentication/register.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginCode from "./authentication/LoginCode.jsx";
import View from "./Admin/public/View.jsx";
import More from "./Admin/public/More.jsx";
import { CartProvider } from "./Admin/public/cartContext.jsx";
import { AuthProvider } from "./authentication/auth.jsx";
import Services from "./utils/utils.js";
import Bag from "./Admin/public/Cart.jsx";

let router = [
  {
    path: "/",
    element: <App />,
    allowedRoles: [],
  },
  {
    path: "/user-login",
    element: <Login />,
    allowedRoles: [],
  },
  {
    path: "user-register",
    element: <SignUp />,
    allowedRoles: [],
  },
  {
    path: "/AdminDashboard",
    element: <AdminDashboard />,
    allowedRoles: ["superuser"],
  },
  {
    path: "/create-user",
    element: <SignInSide />,
    allowedRoles: [],
  },
  {
    path: "/email",
    element: <LoginCode />,
    allowedRoles: [],
  },
  {
    path: "/view",
    element: <View />,
    allowedRoles: [],
  },
  {
    path: "/in",
    element: <More />,
    allowedRoles: [],
  },
  {
    path: "/chittychittybangbang",
    element: <Bag />,
    allowedRoles: [],
  },
];

// (RBAC) FOR UI, API IS SECURE AND INDEPENDENT OF CLIENT SIDE
var services = new Services();
const rt = localStorage.getItem("refreshToken");
const at = localStorage.getItem("authToken");
if (at != null && rt != null) {
  const refresh = () => {
    services
      .refreshToken()
      .then((dat) => {
        const { accessToken, refreshToken } = dat;
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      })
      .catch((err) => {
        console.error("Failed to refresh token: ", err);
      });
  };
  refresh();
  // lets add a mechanism to refresh out token on the interval of 36000s = 1hr
  // we can't exactly do 1 hr because
  // nothing in this world is real time even the light
  setInterval(refresh, 55 * 60 * Math.pow(10, 3));
}

let fitered = router.filter((i) => {
  const roleArray = i.allowedRoles;
  const roleExist = roleArray.indexOf(localStorage.getItem("permissionClass"));
  if (roleArray.length === 0) return true; // no restrictions
  if (roleExist >= 0) return true;
  return false;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={createBrowserRouter(fitered)} />
    </CartProvider>
  </React.StrictMode>
);
