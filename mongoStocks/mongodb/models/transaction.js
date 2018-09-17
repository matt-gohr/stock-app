var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var transactionSchema = new Schema({
  // `title` is of type String
  numberShares: Number,
  // `body` is of type String
  tickerSelected: String,
  totalCost: Number
});

// This creates our model from the above schema, using mongoose's model method
var Transaction = mongoose.model("Transaction", transactionSchema);

// Export the Note model
module.exports = Transaction;
