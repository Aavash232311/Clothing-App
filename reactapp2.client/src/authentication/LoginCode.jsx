import React, { Component } from "react";
import "../static/email.css";
import logo from "../static/images/logo.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default class LoginCode extends Component {
  constructor(props) {
    super(props);
    this.searchParams = new URLSearchParams(window.location.search);
    this.state = {
      mail: this.searchParams.get("mail"),
      code: null,
      failed: false
    }
  }

  submitCode() {
    fetch("/general/activate", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    }).then((rsp => rsp.json())).then((response) => {
      const {statusCode} = response;
      if (statusCode === 400) {
        this.setState({failed: true});
      }
      if (statusCode === 200) {
        window.location.href = "/";
      }
    })
  }
  updateEV(ev) {
    const {name, value} = ev.target;
    this.setState({[name]: value})
  } 
  render() {
    return (
      <>
        <center>
          <div id="Email-Conform">
            <div className="register-logo-placer">
              <img
                className="register-logo"
                height="50"
                width="100%"
                src={logo}
              ></img>
            </div>
            <hr style={{ visibility: "hidden", height: "50px" }}></hr>
            <TextField
              label="Email (4 digit) code.."
              color="secondary"
              type="number"
              className="email-label"
              onInput={(ev) => {this.updateEV(ev)}}
              name="code"
              focused
            />
            <hr style={{ visibility: "hidden", height: "25px" }}></hr>
            {this.state.failed === true ? (
              <>
                <Alert severity="warning">The code you have given is incorrect!</Alert>
                <hr style={{visibility: "hidden"}} ></hr>
              </>
            ) : null}
            <Button
              variant="outlined"
              color="secondary"
              className="email-label"
              onClick={() => {this.submitCode()}}
            >
              SUBMIT
            </Button>
          </div>
        </center>
      </>
    );
  }
}
