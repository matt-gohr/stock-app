var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var watchlistSchema = new Schema({

  tickerSelected: String,
});

// This creates our model from the above schema, using mongoose's model method
var WatchList = mongoose.model("WatchList", watchlistSchema);

// Export the Note model
module.exports = WatchList;