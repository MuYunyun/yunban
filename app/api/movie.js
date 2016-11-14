'use strict';

var mongoose = require('mongoose');
var Movie = mongoose.model('Movie');
var Music = mongoose.model('Music');
var co = require('co'); //用同步的方式编写异步的代码
var Promise = require('bluebird');
var koa_request = require('koa-request');
var request = Promise.promisify(require('request'));
var Category = mongoose.model('Category');
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
	var categories = yield Category
		.find({name: q})
		.populate({
			path: 'movies', 
			select: 'title poster',
		})
		.exec();
	return categories;
};

exports.searchByName = function *(q) {
	var movies = yield Movie
		.find({title: new RegExp(q+ '.*', 'i')})
		.exec();
	return movies;
};

exports.findHotMovies = function *(hot, count) {  //查找电影Top10
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
			select: 'title poster _id rating',
			options: {limit: 10,sort:{rating:-1}}
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

function updateMovies(movie) {   //再查一次详细信息，并对类别进行处理
	var options = {
		url: 'https://api.douban.com/v2/movie/subject/' + movie.doubanId,
		json: true
	};

	request(options).then(function(response) {
		var data = response.body;

		var countries = '';
		data.countries.forEach(function(item, index) {
			countries += item;
			if(index < data.countries.length - 1){  // 最后一个国家不添加'/'
				countries += '/';
			}
		});

		_.extend(movie, {
			country: countries,
			summary: data.summary,
			aka: data.aka[0]
		});

		var genres = movie.genres;
		while(genres.indexOf('/') >= 0){             //把 喜剧/动作/动画 格式转换为数组
			genres = genres.replace('/',',');
		}
		genres = genres.split(',');
		if (genres && genres.length > 0) {
			var cateArray = [];
			var cid = [];
			genres.forEach(function(genre) {
				cateArray.push(function *() {
					var cat = yield Category.findOne({name: genre}).exec();
					if (cat) {
						cat.movies.push(movie._id);
						movie.category.push(cat._id);
						yield cat.save();
						yield movie.save();
					}
					else {                       // 如果该类型不存在创建一个相应的类别
						cat = new Category({
							name: genre,
							movies: [movie._id]
						});
						cat = yield cat.save();        //cat save以后会生成一个id
						cid.push(cat._id);
						console.log(cid);
						var num = 0;
						cid.forEach(function(item) {
							if (item === cat._id){
								num++;
							}
						});
						if(num === 1){
							movie.category.push(cat._id);     // 这里有一个bug,存储的类别会随机重复多出来~~
						}
						yield movie.save();
					}
				});
			});
			co(function* () {
				yield cateArray;
			});
		}
	});
}

exports.searchByDouban = function *(q) {
	var options = {
		url: 'https://api.douban.com/v2/movie/search?q='
	};

	options.url += encodeURIComponent(q);

	var response = yield koa_request(options);
	var data = JSON.parse(response.body);
	var subjects = [];
	var movies = [];

	if (data && data.subjects) {
		subjects = data.subjects;
	}

	if (subjects.length > 0) {
		var queryArray = [];

		subjects.forEach(function(data) {
			queryArray.push(function *() {
				var movie = yield Movie.findOne({doubanId: data.id});

				if (movie) {
					movies.push(movie);
				}
				else { //数据库中没有则存储

					var casts = '';
					if (data.casts && data.casts.length > 0){
						data.casts.forEach(function(item, index) {
							casts += item.name;
							if (index < data.casts.length - 1){
								casts += '/';
							}
						});
					}
					if (data.genres && data.genres.length > 0 && data.directors && data.directors.length > 0) {      //只存取有类型和导演的电影
						var directors = data.directors;
						var director = directors[0];
						var genreName = '';
						data.genres.forEach(function (item, index) {
							genreName += item;
							if (index < data.genres.length - 1) {
								genreName += '/';
							}
						});

						movie = new Movie({
							director: director.name || '',
							title: data.title,
							doubanId: data.id,
							poster: data.images.large,
							year: data.year,
							genres: genreName,
							casts: casts,
							rating: data.rating.average
						});

						movie = yield movie.save();
						movies.push(movie);
					}
				}
			});
		});

		yield queryArray;

		movies.forEach(function(movie) {
			updateMovies(movie);
		});
	}

	return movies;
};
