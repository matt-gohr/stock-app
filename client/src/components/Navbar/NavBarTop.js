import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import "./Navbar.css";

class NavbarTop extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    window.location.href = "/";
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a href="https://tsireact.herokuapp.com/" style={{ width: "30px", marginRight: "20px", fontFamily: "Montserrat", color: "#E5E4E2" }} className="nav-link">
            Bank
          </a>
        </li>
        <li className="nav-item">
          <a style={{ color: "#E5E4E2" }} href="" onClick={this.onLogoutClick.bind(this)} className="nav-link">
            <img src={user.avatar} className="rounded-circle" alt={user.name} style={{ width: "30px", marginRight: "5px" }} title="you must have a Gravatar connected to your email to display an image" /> Logout
          </a>
        </li>
      </ul>;

    const guestLinks = <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link style={{ fontFamily: "Montserrat", color: "#E5E4E2" }} className="navbar-brand" to="/">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link style={{ fontFamily: "Montserrat", color: "#E5E4E2" }} className="navbar-brand" to="/register">
            Register
          </Link>
        </li>
      </ul>;

    return (
      <nav className="navbar navbar-expand-md fixed-top navbar-inverse">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link className="navbar-brand" style={{ 
              fontFamily: "Montserrat", 
              color: "#E5E4E2",  
              fontSize: '25px'}} to="/profile">
            Tech Square Investments
          </Link>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
    );
  }
}

NavbarTop.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(NavbarTop);
