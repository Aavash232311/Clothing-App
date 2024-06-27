import * as React from "react";
import "../static/register.css";
import logo from "../static/images/logo.png";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CheckIcon from '@mui/icons-material/Check';

export default function SignUp() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    conformpassword: "",
  });
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);
  const handleChange = (ev) => {
    const { value, name } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const sendInitialForm = (ev) => {
    ev.preventDefault();
    if (formData.password !== formData.conformpassword) {
      setError([[["aavash"], "The two password field didn't matched"]]);
    } else {
      fetch("/register/", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((rsp) => rsp.json())
        .then((response) => {
          const { status, errors } = response;
          if (status != 200) {
            const temp = [];
            for (let i in errors) {
              temp.push([[i], errors[i]]);
            }
            setError(temp);
          }
        }).catch((error) => {
          // thats what u need to do when u let kids who didn't even leared C
          // handle the authentication frame work (and overwriting is near impossible, least documented)
          // the 200 status code cannot be converted to readable json but error can
          // how logical is that
          setSuccess(true);
        })
    }
  };
  const killerFunction = (ev) => {
    ev.target.parentNode.parentNode.parentNode.remove();
  };
  return (
    <div id="register-body">
      <hr style={{visibility: "hidden", height: "20px"}} />
      <center>
        <div id="register-frame">
          <div className="register-logo-placer">
            <img style={{ borderRadius: "5px " }} className="register-logo" height="50" width="100%" src={logo}></img>
          </div>
          <hr />
          {success === false ? (
            <>
              <h5 className="tracking-in-expand">
                Register your vintagestep account
              </h5>
              <br />
              <form
                action=""
                onSubmit={(ev) => {
                  sendInitialForm(ev);
                }}
                style={{ width: "100%" }}
              >
                <input
                  name="email"
                  onInput={(ev) => {
                    handleChange(ev);
                  }}
                  placeholder="email"
                  className="input-container register-input"
                  type="text"
                  required={true}
                  autoComplete="off"
                />
                <input
                  name="password"
                  onInput={(ev) => {
                    handleChange(ev);
                  }}
                  placeholder="password"
                  type="password"
                  className="input-container register-input"
                  required={true}
                />
                <input
                  name="conformpassword"
                  onInput={(ev) => {
                    handleChange(ev);
                  }}
                  placeholder="conform password"
                  type="password"
                  className="input-container register-input"
                  required={true}
                />
                <button type="submit" className="button-89 input-container" id="css-button" >register</button>
                {error != null ? (
                  <Stack>
                    {error.map((i, j) => {
                      const message = i[1];
                      return (
                        <div key={j * j + 1} className="register-errors">
                          <Alert severity="warning">
                            {message}
                            <div
                              onClick={(ev) => {
                                killerFunction(ev);
                              }}
                              className="cancel-alert"
                            >
                              X
                            </div>
                          </Alert>
                        </div>
                      );
                    })}
                  </Stack>
                ) : null}
                <hr style={{ visibility: "hidden", height: "25px" }}></hr>

              </form>
            </>
          ) : (
            <>
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Here is a gentle confirmation that your action was successful, and an email has been sent to your email address.
              </Alert>
              <Alert severity="success">
                Thank you for choosing us.. -Engineering team and developers
              </Alert>
              <a href={`/email?mail=${formData.email}`}>enter code..</a>
            </>
          )}
        </div>
      </center>
    </div>
  );
}
