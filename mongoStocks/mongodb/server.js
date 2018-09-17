var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var axios = require("axios");

// Require all models (looks to index.js in models folder)
var db = require("./models");
var PORT = 5000;

// Initialize Express
var app = express();

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Use morgan logger for logging requests
app.use(logger("dev"));

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/stocktraderdb", {});

// parse application/json
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// Search for Specific ticker - return JSON file
app.get("/api/:ticker?", function (req, res) {
  var ticker = req.params.ticker;
  console.log("API Lookup: " + ticker);
  var parameters = {
    symbols: ticker,
    types: 'quote,news,chart',
    range: '1m',
    last: '5'
  }
  axios({
      method: 'GET',
      url: 'https://api.iextrading.com/1.0//stock/market/batch',
      params: parameters,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    .then(function (response) {
      res.json(response.data);
    });
});

// Buy route: Intiates a buy transaction. Takes in student id
app.post("/buy/:id", function (req, res) {
  console.log("*********Buy Transaction***********");
  var transaction = req.body;
  console.log(transaction);

  var parameters = {
    symbols: req.body.tickerSelected,
    types: 'quote,news,chart',
    range: '1m',
    last: '5'
  }

  // When buying, does a last minute price check on the stock
  axios({
      method: 'GET',
      url: 'https://api.iextrading.com/1.0//stock/market/batch',
      params: parameters,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    .then(function (response) {
      console.log("Ticker: " + transaction.tickerSelected);
      // purchase.transactionType = purchase.type;
      transaction.numberShares = parseInt(transaction.numberShares);
      var purchasePrice = response.data[transaction.tickerSelected].quote.close;
      console.log("Purchase Price " + purchasePrice);
      transaction.totalCost = purchasePrice * transaction.numberShares;
      var studentID = req.params.id;
      // res.json(response.data);

      console.log(transaction);

      // Looks up student with id = req.params.id
      console.log(req.params.id);

      db.Student.findOneAndUpdate({
          _id: req.params.id
        }, {
          $push: {
            transaction: transaction
          }
        }).then(function (dbStudent) {
          // View the added result in the console
          updatePortfolio(studentID, transaction);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });

    });
});

// Adds to watch list, takes in student id as param
app.post("/watch/:id", function (req, res) {
  console.log("******** Watch List ************");
  var watchlist = req.body;
  console.log(watchlist);
  // looks for student id in db.Student and adds ticker to watch list
  db.Student.findOneAndUpdate({
      _id: req.params.id
    }, {
      $push: {
        watchlist: watchlist
      }
    }).then(function (dbStudent) {
      // View the added result in the console
      console.log(dbStudent);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

// Create new student (currently using dummy data)
app.get("/newstudent", function (req, res) {
  console.log("Adding new student");
  var student = {
    studentName: "John J. Schmit",
    firstName: "John",
    lastName: "Schmit",
    classNumber: 1337,
    cash: 10000
  }
  db.Student.create(student)
    .then(function (dbStudent) {
      // View the added result in the console
      return console.log(dbStudent);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
})

// Lookup all students
app.get("/students", function (req, res) {
  // Lookup all students. To filter by class, add a function here
  db.Student.find({}).sort({
      "_id": -1
    })
    .then(function (dbStudent) {
      res.json(dbStudent);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});















// Takes in transactions and updates the student portfolio***************************************
function updatePortfolio(studentID, transaction) {
  console.log("Update portfolio:");
  console.log(studentID);
  console.log(transaction);

  // Find the transaction Type
  var transactionType = transaction.transactionType;

  // Handle BUY requests - Further check to see if the stock already exists
  if (transactionType === 'buy') {

    // Look up student by id and returns the current portfolio
    db.Student.findById(studentID, function (err, doc) {
      var portfolio = doc.portfolio;
      // Create array of current tickers
      var currentTickers = [];
      // Cycle through portfolio to add all tickers to currentTickers
      for (let i = 0; i < portfolio.length; i++) {
        currentTickers.push(portfolio[i].ticker);
      }
      console.log("Current Portfolio:");
      console.log(currentTickers);
      console.log("Transaction Selected: Buy " + transaction.tickerSelected);

      for (let j = 0; j < currentTickers.length; j++) {
        if (transaction.tickerSelected === currentTickers[j]) {
          console.log(transaction.tickerSelected + " is already in your portfolio! Adding shares.")
          return buyexisting(studentID, transaction)
        }
      }
      // If it gets here, the stock was not in your portfolio and a new entry must be created
      console.log("Running buy new stock function...");
      return buynew(studentID, transaction)
    });

  }
  if (transactionType === 'sell') {
    // Look up student by id and returns the current portfolio
    db.Student.findById(studentID, function (err, doc) {
      var portfolio = doc.portfolio;
      // Create array of current tickers
      var currentTickers = [];
      // Cycle through portfolio to add all tickers to currentTickers
      for (let i = 0; i < portfolio.length; i++) {
        currentTickers.push(portfolio[i].ticker);
      }
      console.log("Current Portfolio:");
      console.log(currentTickers);
      console.log("Transaction Selected: Buy " + transaction.tickerSelected);

      for (let j = 0; j < currentTickers.length; j++) {
        if (transaction.tickerSelected === currentTickers[j]) {
          console.log(transaction.tickerSelected + " is in your portfolio.");
          console.log("You have " + doc.portfolio[j].numberShares + " shares");
          if (doc.portfolio[j].numberShares >= transaction.numberShares) {
            console.log("You have " + doc.portfolio[j].numberShares + " shares");
            console.log("You are selling " + transaction.numberShares + " shares");
            return sellexisting(studentID, transaction)
          } else {
            console.log("Cannot sell more shares than you own!");
          }

        }
      }
      // If it gets here, the stock was not in your portfolio and a new entry must be created
      console.log("Cannot Sell! " + transaction.tickerSelected + " is not in your portfolio!");
      return;
    });
  }


}

// Handles buying a stock you already own
function buyexisting(studentID, transaction) {
  console.log("Adding to existing stock owned")

  db.Student.findById(studentID, function (err, doc) {

    for (let i = 0; i < doc.portfolio.length; i++) {
      if (doc.portfolio[i].ticker === transaction.tickerSelected) {
        var valueArray = doc.portfolio[i].value;
        console.log(valueArray);
        // Create array of transaction values
        var newArray = valueArray;
        newArray.push(transaction.totalCost);
        console.log(newArray);
        // Sum values in array to add new Total Value
        var totalValue = newArray.reduce(function (acc, val) {
          return acc + val;
        });
        var numberShares = doc.portfolio[i].numberShares;
        numberShares = numberShares + transaction.numberShares;

        // Update the whole object with total cost, average cost, and number shares
        db.Student.update({
            _id: studentID,
            "portfolio.ticker": transaction.tickerSelected
          }, {
            $set: {
              "portfolio.$.value": newArray,
              "portfolio.$.totalValue": totalValue,
              "portfolio.$.numberShares": numberShares
            },
            $inc: {
              "cash": -transaction.totalCost
            }
          }).then(function (dbStudent) {
            // Do Something
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      }
    }
  });
}

// Creates new transaction in Student Portfolio 
function buynew(studentID, transaction) {

  console.log("Add new Stock to the portfolio");

  db.Student.findOneAndUpdate({
      _id: studentID
    }, {
      $push: {
        portfolio: {
          ticker: transaction.tickerSelected,
          value: transaction.totalCost,
          numberShares: transaction.numberShares,
          totalValue: transaction.totalCost,
          avargeCost: (transaction.totalCost / transaction.numberShares)
        }
      },
      $inc: {
        "cash": -transaction.totalCost
      }
    }).then(function (dbStudent) {
      // Do Something
      console.log("getting to here?");
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      console.log("Error buying new stock");
      return res.json(err);
    });
}


function sellexisting(studentID, transaction) {
  console.log("SELLING SHARES")

  db.Student.findById(studentID, function (err, doc) {

    for (let i = 0; i < doc.portfolio.length; i++) {
      if (doc.portfolio[i].ticker === transaction.tickerSelected) {
        var valueArray = doc.portfolio[i].value;
        console.log(valueArray);
        // Create array of transaction values
        var newArray = valueArray;
        newArray.push(-transaction.totalCost);
        console.log(newArray);
        // Sum values in array to add new Total Value
        var totalValue = newArray.reduce(function (acc, val) {
          return acc + val;
        });

        var numberShares = doc.portfolio[i].numberShares;
        numberShares = numberShares - transaction.numberShares;

        // Update the whole object with total cost, average cost, and number shares
        db.Student.update({
            _id: studentID,
            "portfolio.ticker": transaction.tickerSelected
          }, {
            $set: {
              "portfolio.$.value": newArray,
              "portfolio.$.totalValue": totalValue,
              "portfolio.$.numberShares": numberShares
            },
            $inc: {
              "cash": transaction.totalCost
            }
          }).then(function (dbStudent) {
            // Do Something
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      }
    }
  });

}

// ****************************************************************************************








// Lookup data for chart
app.get("/chart/:ticker", function (req, res) {
  console.log("*********Chart Lookup***********");
  var ticker = req.params.ticker;
  ticker = ticker.toUpperCase();
  console.log(ticker);
  var parameters = {
    symbols: req.params.ticker,
    types: 'chart,news',
    range: '1y',
    last: '5'
  }
  //  Pull stock data based on parameters
  axios({
      method: 'GET',
      url: 'https://api.iextrading.com/1.0//stock/market/batch',
      params: parameters,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    .then(function (response) {

      var sourceData = response.data;

      var chartArray = []

      for (let index = 0; index < sourceData[ticker].chart.length; index++) {

        var chartValue = {
          date: sourceData[ticker].chart[index].date,
          value: sourceData[ticker].chart[index].close,
        }
        chartArray.push(chartValue);
      }
      var returnObject = {
        price: chartArray,
        news: sourceData[ticker].news
      }
      console.log(returnObject);
      res.json(response.data);
    });
});

// Start the server
app.listen((process.env.PORT || 5000), function () {
  console.log("App running on port " + PORT + "!");
});