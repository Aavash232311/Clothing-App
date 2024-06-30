import React, { createContext, useState, useContext } from "react";
const AuthContext = createContext(undefined);
import Services from "../utils/utils";

export default AuthContext;
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  const [user, setUser] = useState(() => (authToken ? authToken : null));
  const services = new Services();
  const logOut = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };
  const logIn = async (username, password) => {
    let data = await fetch("/login/", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        return response;
      });
    if (data.accessToken !== undefined) {
      localStorage.setItem("authToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // lets add a mechanism to refresh out token on the interval of 36000s = 1hr
      // we can't exactly do 1 hr because
      // nothing in this world is real time even the light
      setInterval(() => {
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
      }, 55 * 60 * Math.pow(10, 3));
      
      fetch("/general/getRls", {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { statusCode, value } = response;
          if (statusCode === 200) {
            console.log(value);
            localStorage.setItem("permissionClass", value[0]);
          }
        });
      // do long poling here
      setUser(true);
      return true;
    }
    setUser(false);
    return false;
  };

  let methods = {
    user: user,
    logOut: logOut,
    logIn: logIn,
  };

  return (
    <AuthContext.Provider value={methods}>{children}</AuthContext.Provider>
  );
};
