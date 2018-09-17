import React from "react";
import "./News.css";

const News = props => (
  <div className="news col-6">
    <h1>Market News</h1>
    <a href={props.newsLink1} target="_blank"><p id="blurb">{props.news1}</p></a><br />
    <a href={props.newsLink2} target="_blank"><p id="blurb">{props.news2}</p></a><br />
    <a href={props.newsLink3} target="_blank"><p id="blurb">{props.news3}</p></a><br />
  </div>)

export default News;
