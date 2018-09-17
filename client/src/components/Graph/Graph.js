import React from "react";
import "./Graph.css";
import ReactChartist from "react-chartist";
import SellButton from "../BuyAndSellBtn/SellButton";
import BuyButton from "../BuyAndSellBtn/BuyButton";

const Graph = props => {
  
  return <div className="graph card">
      <div className="row justify-content-start" style={{ marginBottom: "30px" }}>
        <div className="col-4">
          <div className="row">
            <BuyButton 
            currentStock={props.currentStock}
            currentStockPrice={props.currentStockPrice} />
          </div>
          <div className="row">
            <SellButton 
            currentStockPrice={props.currentStockPrice}
            currentStock={props.currentStock} />
          </div>
        </div>
        <div className="header col-4">
          <h4 id="stockTitle">{props.title}</h4>
          <h4 id="stockTitle">{props.currentPrice}</h4>
        </div>
      </div>

      <div className="content">
        <ReactChartist data={{ labels: props.timeline, series: [props.priceArray] }} options={{ lineSmooth: true, height: "350px", axisY: { offset: 60, labelInterpolationFnc: function(value) {
                return "$" + value;
              } }, stretch: true, low: props.min, high: props.max, classNames: { point: "ct-point ct-green", line: "ct-line ct-green" } }} type="Line" className="ct-chart" />
      </div>
      <div className="row" id="btnRow">
        <button onClick={() => props.displayWeek()}>Week</button>
        <button onClick={() => props.displayMonth()}>Month</button>
        <button onClick={() => props.displayQuarter()}>Quarter</button>
        <button onClick={() => props.displayYear()}>Year</button>
      </div>
    </div>;
};

export default Graph;
