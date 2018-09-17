import React from "react";
import "./PieChart.css";
import ReactChartist from 'react-chartist';
import axios from 'axios';



class PieChart extends React.Component {

    state = {
      portfolio: [],
      portfolioSum: 10
    };

    componentDidMount() {
      const auth = localStorage.getItem("jwtToken");

      axios({
          method: 'GET',
          url: '/api/users/current',
          headers: {
            'Cache-Control': 'no-cache',
            Authorization: auth
          }
        })
        .then((response) => {

          // let stockData = response.data['AAPL'];
          console.log(response.data.portfolio);
          let portfolio = response.data.portfolio;
          const portfolioValue = [];
          let portfolioSum = 0;
          for (let i = 0; i < portfolio.length; i++) {
            portfolioValue.push(portfolio[i].totalValue);
            portfolioSum = portfolioSum + portfolio[i].totalValue;
          }
          console.log("PIIIIIIIIIEIIEIEIEIIEIEIEIIEIEI")
          console.log(portfolioValue);
          console.log(portfolioSum);
          this.setState({portfolioSum: portfolioSum});
          this.setState({portfolio: portfolioValue});

        }).catch(response => {
          console.log(response);
        });
    }


render() {
  return (
  <div className="piechart col-6">
    {/*Graph goes below*/}
    <div className=" pie card">
        <h4>Portfolio Diversity</h4>

        <div className="header">

          <h4>{this.props.title}</h4>

        </div>

        <div className="content">

          <ReactChartist data={{
                series: this.state.portfolio
          }} options={{

            donut: true,

            donutWidth: 60,

            startAngle: 0,

            height: "245px",

            total: this.state.portfolioSum,

            showLabel: true,

            axisX: {

              showGrid: false,

              offset: 0

            },

            axisY: {

              offset: 0

            }

          }} type="Pie" className="ct-chart" />

        </div>

        <div className="footer">


          <div className="legend">
            {
              /* <i className="fa fa-circle" id="btn1"></i> Microsoft

            <i className="fa fa-circle" id="btn2"></i> SPDR<br />

            <i className="fa fa-circle" id="btn3"></i> Facebook

            <i className="fa fa-circle" id="btn4"></i> Apple<br />

            <i className="fa fa-circle" id="btn5"></i> Tesla

            <i className="fa fa-circle" id="btn6"></i> Amazon<br />

            <i className="fa fa-circle" id="btn7"></i> USO

            <i className="fa fa-circle" id="btn8"></i> DOW<br /> */}
          </div>

        </div>

      </div>

  </div>
    )
  }
}
      
export default PieChart;
