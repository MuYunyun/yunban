'use strict';
var mongoose = require('mongoose');
var CitySchema = require('../../schemas/movie/movie_city');
var City = mongoose.model('City', CitySchema);

module.exports = City;