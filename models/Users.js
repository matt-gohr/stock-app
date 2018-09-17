const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  classNumber: {
    type: String,
    required: true
  },
  cash: {
    type: Number
  },
  transaction: [{
    transactionType: String,
    numberShares: Number,
    tickerSelected: String,
    totalCost: Number
  }],
  watchlist: [{
    tickerSelected: {
      type: String,
      required: true
    }
  }],
  portfolio: [{
    ticker: {
      type: String,
      required: true
    },
    value: [Number],
    totalValue: Number,
    numberShares: Number,
    averageCost: Number
  }]
});

module.exports = User = mongoose.model("users", UserSchema);