var mongoose = require('mongoose');
var CategorySchema = require('../../schemas/movie/movie_category');
var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;