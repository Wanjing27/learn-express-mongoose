var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema(
  {}
);

//Export model
module.exports = mongoose.model('Book', BookSchema);
  