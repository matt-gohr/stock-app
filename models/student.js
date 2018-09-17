var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var studentSchema = new Schema({
  // `student name` is required and of type String
  studentName: {
    type: String,
    required: true,
    unique: false
  },
  // All transactions: buy/sell
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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
      required: true,
      unique: true
    }
  }],

  portfolio: [{
    ticker: {
      type: String,
      required: true,
      unique: true
    },
    value: [Number],
    totalValue: Number,
    numberShares: Number,
    avargeCost: Number
  }]

});

// This creates our model from the above schema, using mongoose's model method
var Student = mongoose.model("student", studentSchema);

// Export the Article model
module.exports = Student;