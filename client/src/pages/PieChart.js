import React from 'react';
import ReactChartist from 'react-chartist';
import Chartist from 'chartist';

const optionsPreferences = {

  donut: true,

  donutWidth: 40,

  startAngle: 0,

  height: "245px",

  total: 100,

  showLabel: false,

  axisX: {

    showGrid: false,

    offset: 0

  },

  axisY: {

    offset: 0

  }

};

const PieChart = props => (

  <div className=" pie card">

    <div className="header">

      <h4>{props.title}</h4>

    </div>

    <div className="content">

      <ReactChartist data={{
            labels: ['62%','32%','6%'],
            series: [62, 32, 6]
      }}data={dataPreferences} options={optionsPreferences} type="Pie" className="ct-chart" />

    </div>

    <div className="footer">



      <i className="fa fa-circle text-info"></i> Apple

      <i className="fa fa-circle text-warning"></i> Samsung

      <i className="fa fa-circle text-danger"></i> Windows Phone

    </div>

  </div>

);

export default PieChart;
