import React, { Component } from "react";
import { BrowserRouter as Router, Route  } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions'
import store from './store';
import "./App.css";

//Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";

//check for token
if(localStorage.jwtToken){
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);

  //decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);

  //set user and is Authenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime){
    //logout user
    store.dispatch(logoutUser());

    //TODO clear current profile

    //redirect to login
    window.location.href = '/';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/" component={Login} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
