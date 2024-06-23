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
  }
];

// (RBAC) FOR UI, API IS SECURE AND INDEPENDENT OF CLIENT SIDE

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
