const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const axios = require("axios");
const path = require("path");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
const db = require('./config/keys').mongoURI
require('dotenv').config();

//passport 
require('./config/passport')(passport);

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Passport
app.use(passport.initialize());

// Serve up static assets
// app.use(express.static("client/build"));
// Add routes, both API and view
app.use(routes);

//serve static if in producion
if(process.env.NODE_ENV === 'production'){
  //set static folder
  app.use(express.static("client/build"));
  console.log("were in PRODUCTION BABY!")

  app.get("*", (req, res) => {
    res.sendfile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Connect to the Mongo DB
mongoose
  .connect(process.env.MONGODB_URI || db)
  .then(() => console.log("MongooDB Connected"))
  .catch(err => console.log(err));

// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});