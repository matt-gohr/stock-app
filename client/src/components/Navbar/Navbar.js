import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NavLinks from "../NavLinks";
import "./Navbar.css";
// import stocks from "../../stocks.json";

// Depending on the current path, this component sets the "active" classNameName on the appropriate navigation link item
class Navbar extends React.Component {
  

  componentDidMount(){

  }
  render() {
    const { user } = this.props.auth

    return (
      <div className="col-4 col-lg-3 bd-sidebar" id="bd-docs-nav">
        <nav>
          <div className="bd-toc-item" id="studentName">
            Welcome, {user.name}
          </div>
          <div className="bd-toc-item" id="balance">
           Cash Balance: <span id = "cashbalance" >${this.props.cash.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="bd-toc-item" id="balance">
           Portfolio Balance: <span id = "cashbalance" >${this.props.portfolioSum.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</span>
          </div>
        </nav>
        {this.props.portfolio.map(stock => (
          <NavLinks
            handleClick={this.props.handleClick}
            name={stock.ticker.toUpperCase()}
            id={stock.ticker.toUpperCase()}
            />
        ))}
      </div>
    )}
  };

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, {})(Navbar);
