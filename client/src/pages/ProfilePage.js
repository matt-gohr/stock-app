import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Navbar from "../components/Navbar";
import Title from "../components/Title";
import Graph from "../components/Graph";
import News from "../components/News";
import PieChart from "../components/PieChart";
import stocks from "../stocks.json";
import NavBarTop from "../components/Navbar/NavBarTop.js";

let axios = require("axios");

// let image = "./images/graph.png";
let title = "Stocks";
let news1 = "";
let newsLink1 = "";
let news2 = "";
let newsLink2 = "";
let news3 = "";
let newsLink3 = "";
let min = 0;
let max = 1000;
let currentStock = "";
let currentPrice = "";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks,
      title,
      priceArray: [],
      // title: "",
      currentStock: "",
      currentStockPrice: 0,
      timeline: [],
      dayLimit: 21,
      portfolio: [],
      cash: 0,
      portfolioSum: 0
    };

    this.stockSearch("");
  }

  getCurrentUserData() {
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
        this.setState({ portfolio: response.data.portfolio });
        this.setState({ cash: response.data.cash });
        let portfolio = response.data.portfolio;
        let portfolioSum = 0;
        for (let i = 0; i < portfolio.length; i++) {
          portfolioSum = portfolioSum + portfolio[i].totalValue;
        }
        this.setState({ portfolioSum: portfolioSum });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    //if logged in and trying to go to the login page redirect to profile page
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    // const sesToken = sessionStorage.getItem("jwtToken");
    this.displayMonth();
    this.getCurrentUserData();
  }

  handleClick = searchedStock => {
    const ticker = searchedStock.toUpperCase();
    this.setState({ currentStock: ticker });
    console.log(ticker);

    if (ticker) {
      //  Pull stock data based on parameters
      var parameters = {
        symbols: ticker,
        types: "quote,chart,news",
        range: "1y",
        last: "5"
      };

      axios({
        method: "GET",
        url: "/api/search/search",
        params: parameters
      })
        .then(response => {
          let stockData = response.data[ticker];
          console.log(stockData);

          const priceArray = [];
          for (
            let i = stockData.chart.length - (this.state.dayLimit - 1);
            i < stockData.chart.length;
            i++
          ) {
            priceArray.push(stockData.chart[i].close);
          }
          priceArray.push(stockData.quote.close);

          currentPrice = "$" + stockData.quote.close;
          this.setState({ title: stockData.quote.companyName });

          this.setState({currentStockPrice: stockData.quote.close})

          //Adding News
          news1 = stockData.news[0].headline;
          newsLink1 = stockData.news[0].url;

          news2 = stockData.news[1].headline;
          newsLink2 = stockData.news[1].url;

          news3 = stockData.news[2].headline;
          newsLink3 = stockData.news[2].url;

          min = Math.min.apply(Math, priceArray);
          max = Math.max.apply(Math, priceArray);

          // const priceArray = stockData.chart
          //   .map( quote => quote.close )
          //   .filter( (quote, i) => i < dayLimit );

          this.setState({ priceArray });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  displayWeek = () => {
    let newArray = [];
    for (var i = 0; i < 6; i++) {
      newArray.push(i);
    }
    this.setState({
      timeline: newArray,
      dayLimit: 6
    });
    console.log(currentStock);
    this.handleClick(this.state.currentStock);
  };

  displayMonth = () => {
    let newArray = [];
    for (var i = 0; i < 21; i++) {
      newArray.push(i);
    }
    this.setState({
      timeline: newArray,
      dayLimit: 21
    });
    this.handleClick(this.state.currentStock);
  };

  displayQuarter = () => {
    let newArray = [];
    for (var i = 0; i < 63; i++) {
      if (i % 5 === 0) {
        newArray.push(i);
      } else {
        newArray.push("");
      }
    }
    this.setState({
      timeline: newArray,
      dayLimit: 63
    });
    this.handleClick(this.state.currentStock);
  };

  displayYear = () => {
    let newArray = [];
    for (var i = 0; i < 251; i++) {
      if (i % 25 === 0) {
        newArray.push(i);
      } else {
        newArray.push("");
      }
    }
    this.setState({
      timeline: newArray,
      dayLimit: 251
    });
    this.handleClick(this.state.currentStock);
  };

  stockSearch(stock) {
    this.handleClick(stock);
  }

  render() {
    return (
      <div className="app">
        <NavBarTop />
        <div className="margin-top">
          <Navbar
            portfolio={this.state.portfolio}
            cash={this.state.cash}
            portfolioSum={this.state.portfolioSum}
            handleClick={this.handleClick}
          />

          <Wrapper>
            <Title stockSearchButtonClick={stock => this.stockSearch(stock)} />

            <Graph
              title={this.state.title}
              currentStock={this.state.currentStock}
              currentStockPrice={this.state.currentStockPrice}
              cash={this.state.cash}
              currentPrice={currentPrice}
              priceArray={this.state.priceArray}
              min={min}
              max={max}
              timeline={this.state.timeline}
              displayWeek={this.displayWeek}
              displayMonth={this.displayMonth}
              displayQuarter={this.displayQuarter}
              displayYear={this.displayYear}
            />

            <div className="row">
              <News
                news1={news1}
                newsLink1={newsLink1}
                news2={news2}
                newsLink2={newsLink2}
                news3={news3}
                newsLink3={newsLink3}
              />
              <PieChart />
            </div>
          </Wrapper>
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {})(ProfilePage);
