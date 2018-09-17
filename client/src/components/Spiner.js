import React from "react";
import spinner from "../assets/images/spinner-white.gif";

export default () => {
  return (
    <div className="align-items-center">
      <img src={spinner} style={{ width: "40px", margin: "auto" }} alt = "apparantly alt is required"/>
    </div>
  );
};
