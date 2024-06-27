import React, { Component } from "react";
import "../../static/ship.css";

class Shipping extends Component {
  state = {
    charge: null,
  };
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.setDelivaryCharge = this.setDelivaryCharge.bind(this);
    this.update = this.update.bind(this);
  }
  componentDidMount() {
    fetch("public/deliveryCharge", {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode, value } = response;
        if (statusCode !== 200) return;
        const { deliveryAmount } = value;
        this.setState({ charge: deliveryAmount });
      });
  }
  update(ev) {
    const { name, value } = ev.target;
    this.setState({ [name]: value });
  }

  setDelivaryCharge(ev) {
    ev.preventDefault();
    console.log(this.state.charge);
    fetch(`staff/set-delivery-charge?charge=${this.state.charge}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        const { statusCode } = response;
        if (statusCode === 200) {
          alert("Value has been set");
        }
      });
  }
  render() {
    return (
      <div id="shipping-frame">
        <div className="classic-label shipping-label">
          Estimated Shipping cost
        </div>
        <form onSubmit={this.setDelivaryCharge}>
          <div className="shipping-label">
            <input
              placeholder="Rs."
              className="classic-input shipping-input"
              name="charge"
              type="number"
              onInput={this.update}
              defaultValue={this.state.charge != null ? this.state.charge : ""}
            ></input>
          </div>
          <div className="shipping-label">
            <button type="submit" className="button-14 shipping-input">
              set
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Shipping;
