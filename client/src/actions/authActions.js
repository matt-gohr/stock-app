import axios from "axios";
import setAuthToken from '../utils/setAuthToken.js';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("api/users/register", userData)
    .then(res => {
      history.push('/')
      
      //TODO: create new object that can be used to login the user and send them to the profile pag
      
            // console.log(res);
            // console.log(userData);
    })    
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//login Get user Token

export const loginUser = (userData) => dispatch => {
  axios
    .post("api/users/login", userData)
    .then(res => {
      //save to local storage
      const { token } = res.data;

      //set token to local storage
      localStorage.setItem('jwtToken', token)

      // set token to Auth header
      setAuthToken(token);

      //decode token to get user data
      const decoded = jwt_decode(token);

      // set current user 
      dispatch(setCurrentUser(decoded));

    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// set logged-in user 
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

//gog user out if token expired
export const logoutUser = () => dispatch => {
  //remove token from local storage
  localStorage.removeItem('jwtToken');
  console.log('logout pressed')

  //remove auth
  setAuthToken(false);

  //set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
}
