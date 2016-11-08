'use strict';

var mongoose = require('mongoose');
var Music = mongoose.model('Music');
var co = require('co'); //用同步的方式编写异步的代码
var Promise = require('bluebird');
var koa_request = require('koa-request');
var request = Promise.promisify(require('request'));
var MusicCategory = mongoose.model('MusicCategory');
var _ = require('lodash');

// index page
exports.findAll = function *() {
  var categories = yield Category
      .find({})
      .populate({
        path: 'movies',
        select: 'title poster',
        options: { limit: 6 }
      })
      .exec();

  return categories;
};

exports.searchByCategory = function *(q) {
  var categories = yield MusicCategory
      .find({name: q})
      .populate({
        path: 'musics',
        select: 'title poster',
      })
      .exec();
  return categories;
};

exports.searchByName = function *(q) {
  var musics = yield Music
      .find({title: new RegExp(q+ '.*', 'i')})
      .exec();
  return musics;
};

exports.findHotMovies = function *(hot, count) {
  var movies = yield Movie
      .find({})
      .sort({'pv': hot})
      .limit(count)
      .exec();

  return movies;
};

exports.findMoviesByCate = function *(cat) {
  var category = yield Category
      .findOne({name: cat})
      .populate({
        path: 'movies',
        select: 'title poster _id'
      })
      .exec();

  return category;
};

exports.searchById = function *(id) {
  var movie = yield Movie
      .findOne({_id: id})
      .exec();

  return movie;
};

