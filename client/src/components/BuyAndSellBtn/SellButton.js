import "./button.css";
import React, { Component } from "react";
import Modal from "react-modal";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    // color: "green",
    overlay: { zIndex: 99999999999 }
  }
};
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

class SellButton extends Component {
  componentDidMount() {
    const auth = localStorage.getItem("jwtToken");

    axios({
      method: "GET",
      url: "/api/users/current",
      headers: {
        "Cache-Control": "no-cache",
        Authorization: auth
      }
    })
      .then(response => {
        // let stockData = response.data['AAPL'];
        console.log(response.data);
        this.setState({
          student: response.data
        });
      })
      .catch(response => {
        console.log(response);
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      shares: 0,
      student: {},
      modalIsOpen: false,
      message: "",
      totalCost: ""
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div className="input-group mb-3 justify-content-center">
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h3 style={{ color: "green", fontweight: "bold" }}>
            {" "}
            {this.state.message}
          </h3>
          <p style={{ color: "black", fontweight: "bold" }}>
            {" "}
            {this.state.totalCost}
          </p>
        </Modal>
        <div
          style={{ height: "40px", width: "60px" }}
          className="input-group-prepend "
        >
    <button style={{ margin: "0px", height: "100%" }} className="btn btn-outline-danger" 
          type="button" onClick={event => this.sellStock(this.props.currentStock, this.state.shares, this.props.currentStockPrice)}>
            Sell
          </button>
        </div>
        <input
          type="number"
          onChange={this.onChange}
          name="shares"
          value={this.state.shares}
          className="form-control col-4"
          placeholder="# Shares"
          aria-label=""
          min="0"
          max="1000"
          aria-describedby="basic-addon1"
        />
      </div>
    );
  }

  sellStock(ticker, shares, price) {
    // event.preventDefault();
    console.log("Current Stock");

    console.log(ticker);
    console.log(shares);
    let portfolio = this.state.student.portfolio;
    // let price = 100;
    let numShares = 0;

    for (let i = 0; i < portfolio.length; i++) {
      if (ticker === portfolio[i].ticker.toUpperCase()) {
        console.log("Matches portfolio stock!");
        numShares = portfolio[i].ticker.numberShares;
        if (shares > numShares) {
          if (numShares === 0) {
            this.setState({
              message: "You have no shares of " + ticker + "!"
            });
          }
          this.setState({
            message: "Not enough shares to sell!"
          });
          this.setState({
            totalCost: "You have " + numShares + " of " + ticker + " to sell."
          });
        } else {
          this.setState({
            message: "You sold " + shares + " shares of " + ticker + "!"
          });
          this.setState({
            totalCost: "Total return: $" + price * shares
          });
          var transaction = {
            type: "sell",
            numberShares: shares,
            tickerSelected: ticker
          };

          axios({
            method: "POST",
            url: "/api/transactions/transaction/" + this.state.student._id,
            data: transaction,
            headers: {
              "Cache-Control": "no-cache",
              Authorization: auth
            }
          })
            .then(response => {
              console.log(response);
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    }

    this.openModal();
    const auth = localStorage.getItem("jwtToken");
  }
}

export default SellButton;
