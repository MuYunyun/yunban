var mongoose = require('mongoose');
var MovieSchema = require('../../schemas/movie/movie');
var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;