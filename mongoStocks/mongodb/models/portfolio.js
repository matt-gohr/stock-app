var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var portfolioSchema = new Schema({
  // `title` is of type String
  ticker: String,
  // `body` is of type String
  value: Number,

  avargeCost: Number
});

// This creates our model from the above schema, using mongoose's model method
var Portfolio = mongoose.model("Portfolio", portfolioSchema);

// Export the Note model
module.exports = Portfolio;
