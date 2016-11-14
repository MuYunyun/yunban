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

exports.findHotMusics = function *(hot, count) {  //查找音乐Top10
  var musics = yield Music
      .find({})
      .sort({'pv': hot})
      .limit(count)
      .exec();

  return musics;
};

exports.findMusicsByCate = function *(cat) {
  var category = yield MusicCategory
      .findOne({name: cat})
      .populate({
        path: 'musics',
        select: 'title poster _id rating',
        options: {limit: 10,sort:{rating:-1}}
      })
      .exec();

  return category;
};

exports.searchById = function *(id) {
  var music = yield Music
      .findOne({_id: id})
      .exec();

  return music;
};

