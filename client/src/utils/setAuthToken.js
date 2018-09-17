import axios from "axios";

const setAuthToken = token => {
  if (token) {
    //appy to every request
    axios.defaults.headers.common["Autherization"] = token;
  } else {
    //delete Auth header
    delete axios.defaults.headers.common["Autherization"];
  }
};

export default setAuthToken;
