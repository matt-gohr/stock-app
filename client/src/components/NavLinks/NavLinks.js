import React from "react";
// import { Link } from "react-router-dom";
import "./NavLinks.css";

// Depending on the current path, this component sets the "active" classNameName on the appropriate navigation link item
const NavLinks = props => {

  return (
    <div onClick={() => props.handleClick(props.name)}>
      <ul className="nav bd-sidenav">
        <li className="bd-toc-link active">{props.id}</li>
      </ul>
    </div>
  );
};

export default NavLinks;
