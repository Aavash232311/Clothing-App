import React, { createContext, useState, useContext } from "react";
const AuthContext = createContext(undefined);

export default AuthContext;
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  const [user, setUser] = useState(() => (authToken ? authToken : null));
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
      fetch("/general/getRls", {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.accessToken}`
        },
      }).then((rsp) => rsp.json()).then((response) => {
        const {statusCode, value} = response;
        if (statusCode === 200) {
          console.log(value);
          localStorage.setItem("permissionClass", value[0]);
        }
      })
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