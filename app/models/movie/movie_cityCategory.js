'use strict';
var mongoose = require('mongoose');
var CityCategorySchema = require('../../schemas/movie/movie_cityCategory');
var CityCategory = mongoose.model('CityCategory', CityCategorySchema);

module.exports = CityCategory;