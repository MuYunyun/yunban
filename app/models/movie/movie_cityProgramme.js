'use strict';
var mongoose = require('mongoose');
var CityProgrammeSchema = require('../../schemas/movie/movie_cityProgramme');
var CityProgramme = mongoose.model('CityProgramme', CityProgrammeSchema);

module.exports = CityProgramme;