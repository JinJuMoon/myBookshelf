var mongoose = require("mongoose");

var bookSchema = mongoose.Schema({
  title: String,
  author: String,
  image: String,
  review: String
});

module.exports = mongoose.model("Book", bookSchema);
