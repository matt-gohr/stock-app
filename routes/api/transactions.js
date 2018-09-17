const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../../models/Users");
const passport = require("passport");

// @route   GET api/us/test
// @desc    Test post route
// @access  Private
router.get("/test", (req, res) =>
  res.json({
    msg: "transactions Works"
  })
);

router.post("/transaction/:id?", function(req, res) {
  console.log("*********Buy Transaction***********");

  // Needs purchase.tickerSelected & purchase.numberShares

  var purchase = req.body;
  var auth = req.headers.authorization;
  console.log(purchase);
  console.log(auth);
  console.log(purchase);
  var ticker = req.body.tickerSelected.toUpperCase();
  console.log("Ticker is: " + ticker)

    var parameters = {
        symbols: ticker.toUpperCase(),
        types: 'quote,news,chart',
        range: '1m',
        last: '5'
    }

  // When buying, does a last minute price check on the stock
  axios({
    method: "GET",
    url: "https://api.iextrading.com/1.0//stock/market/batch",
    params: parameters,
    headers: {
      "Cache-Control": "no-cache"
    }
  }).then(function(response) {
    console.log("Ticker: " + ticker);
    // console.log(response);
    var purchasePrice = response.data[ticker].quote.close;
    console.log("Purchase Price " + purchasePrice);
    purchase.totalCost = purchasePrice * purchase.numberShares;
    var studentID = req.params.id;
    console.log("USER ID");
    console.log(studentID);

    // Looks up student with id = req.params.id
    // console.log(email);
    User.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $push: {
          transaction: purchase
        }
      }
    )
      .then(function(dbStudent) {
        // View the added result in the console
        // console.log(dbStudent);
        updatePortfolio(studentID, purchase).then((res, err) => {
          console.log(`returned: ${res}`);
        });
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
  });
});

function updatePortfolio(studentID, transaction) {
  console.log("Update portfolio:");
  console.log(studentID);
  console.log(transaction);

  // Find the transaction Type
  var transactionType = transaction.type;

  // Handle BUY requests - Further check to see if the stock already exists
  if (transactionType === "buy") {
    console.log("Gets here");

    // Look up student by id and returns the current portfolio
    User.findById(studentID, function(err, doc) {
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
          console.log(
            transaction.tickerSelected +
              " is already in your portfolio! Adding shares."
          );
          return buyexisting(studentID, transaction)
          
        }
      }
      // If it gets here, the stock was not in your portfolio and a new entry must be created
      console.log("Running buy new stock function...");
      return buynew(studentID, transaction);
    });
  }
  if (transactionType === "sell") {
    // Look up student by id and returns the current portfolio
    User.findById(studentID, function(err, doc) {
      var portfolio = doc.portfolio;
      // Create array of current tickers
      var currentTickers = [];
      // Cycle through portfolio to add all tickers to currentTickers
      for (let i = 0; i < portfolio.length; i++) {
        currentTickers.push(portfolio[i].ticker);
      }
      console.log("Current Portfolio:");
      console.log(currentTickers);
      console.log(`Transaction Selected: ${transactionType} transaction.tickerSelected`);

      for (let j = 0; j < currentTickers.length; j++) {
        if (transaction.tickerSelected === currentTickers[j]) {
          // console.log(transaction.tickerSelected + " is in your portfolio.");
          // console.log("You have " + doc.portfolio[j].numberShares + " shares");
          if (doc.portfolio[j].numberShares >= transaction.numberShares) {
            // console.log("You have " + doc.portfolio[j].numberShares + " shares");
            // console.log("You are selling " + transaction.numberShares + " shares");
            return sellexisting(studentID, transaction);
          } else {
            console.log("Cannot sell more shares than you own!");
          }
        }
      }
      // If it gets here, the stock was not in your portfolio and a new entry must be created
      console.log(
        "Cannot Sell! " +
          transaction.tickerSelected +
          " is not in your portfolio!"
      );
      return "hey you returned something";
    });
  }
}

// Handles buying a stock you already own
function buyexisting(studentID, transaction) {
  
    User.findById(studentID, function(err, doc) {
      console.log("Adding to existing stock owned");

      for (let i = 0; i < doc.portfolio.length; i++) {
        if (doc.portfolio[i].ticker === transaction.tickerSelected) {
          var valueArray = doc.portfolio[i].value;
          console.log(valueArray);
          // Create array of transaction values
          var newArray = valueArray;
          newArray.push(transaction.totalCost);
          console.log(newArray);
          // Sum values in array to add new Total Value
          var totalValue = newArray.reduce(function(acc, val) {
            return acc + val;
          });
          var numberShares = doc.portfolio[i].numberShares;
          numberShares = numberShares + transaction.numberShares;

          // Update the whole object with total cost, average cost, and number shares
          User.update(
            {
              _id: studentID,
              "portfolio.ticker": transaction.tickerSelected
            },
            {
              $set: {
                "portfolio.$.value": newArray,
                "portfolio.$.totalValue": totalValue,
                "portfolio.$.numberShares": numberShares
              },
              $inc: {
                cash: -transaction.totalCost
              }
            }
          )
            .then(function(dbStudent) {
              resolve(dbStudent);
            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              reject(err);
            });
        }
      }
    });
}

// Creates new transaction in Student Portfolio
function buynew(studentID, transaction) {
  console.log("Add new Stock to the portfolio");

  User.findOneAndUpdate(
    {
      _id: studentID
    },
    {
      $push: {
        portfolio: {
          ticker: transaction.tickerSelected,
          value: transaction.totalCost,
          numberShares: transaction.numberShares,
          totalValue: transaction.totalCost,
          avargeCost: transaction.totalCost / transaction.numberShares
        }
      },
      $inc: {
        cash: -transaction.totalCost
      }
    }
  )
    .then(function(dbStudent) {
      // Do Something
      console.log("getting to here?");
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      console.log("Error buying new stock");
      return res.json(err);
    });
}

function sellexisting(studentID, transaction) {
  console.log("SELLING SHARES");

  User.findById(studentID, function(err, doc) {
    for (let i = 0; i < doc.portfolio.length; i++) {
      if (doc.portfolio[i].ticker === transaction.tickerSelected) {
        var valueArray = doc.portfolio[i].value;
        console.log(valueArray);
        // Create array of transaction values
        var newArray = valueArray;
        newArray.push(-transaction.totalCost);
        console.log(newArray);
        // Sum values in array to add new Total Value
        var totalValue = newArray.reduce(function(acc, val) {
          return acc + val;
        });

        var numberShares = doc.portfolio[i].numberShares;
        numberShares = numberShares - transaction.numberShares;

        // Update the whole object with total cost, average cost, and number shares
        User.update(
          {
            _id: studentID,
            "portfolio.ticker": transaction.tickerSelected
          },
          {
            $set: {
              "portfolio.$.value": newArray,
              "portfolio.$.totalValue": totalValue,
              "portfolio.$.numberShares": numberShares
            },
            $inc: {
              cash: transaction.totalCost
            }
          }
        )
          .then(function(dbStudent) {
            // Do Something
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      }
    }
  });
}

module.exports = router;
