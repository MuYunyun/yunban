var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var co = require('co') //用同步的方式编写异步的代码
var Promise = require('bluebird')
var koa_request = require('koa-request')
var request = Promise.promisify(require('request'))
var Category = mongoose.model('Category')
var _ = require('lodash')

// index page
exports.findAll = function *() {
	var categories = yield Category
		.find({})
		.populate({
			path: 'movies',
			select: 'title poster',
			options: { limit: 6 }
		})
		.exec()

	return categories
}

exports.searchByCategory = function *(catId) {
	var categories = yield Category
		.find({_id: catId})
		.populate({
			path: 'movies', 
			select: 'title poster',
		})
		.exec()

	return categories
}

exports.searchByName = function *(q) {
	var movies = yield Movie
		.find({title: new RegExp(q+ '.*', 'i')})
		.exec()
		
	return movies
}

exports.findHotMovies = function *(hot, count) {
	var movies = yield Movie
		.find({})
		.sort({'pv': hot})
		.limit(count)
		.exec()
		
	return movies
}

exports.findMoviesByCate = function *(cat) {
	var category = yield Category
		.findOne({name: cat})
		.populate({
			path: 'movies',
			select: 'title poster _id'
		})
		.exec()
		
	return category
}

exports.searchById = function *(id) {
	var movie = yield Movie
		.findOne({_id: id})
		.exec()
		
	return movie
}

function updateMovies(movie) {   //再查一次详细信息，并对类别进行处理
	var options = {
		url: 'https://api.douban.com/v2/movie/subject/' + movie.doubanId,
		json: true
	}

	request(options).then(function(response) {
		var data = response.body

		_.extend(movie, {
			country: data.countries[0],
			language: data.language,
			summary: data.summary
		})

		console.log(movie)

		var genres = movie.genres

		if (genres && genres.length > 0) {
			var cateArray = []

			genres.forEach(function(genre) {
				cateArray.push(function *() {
					var cat = yield Category.findOne({name: genre}).exec()

					if (cat) {
						cat.movies.push(movie._id)  
						yield cat.save()
						yield movie.save()
					}
					else {
						cat = new Category({
							name: genre,
							movies: [movie._id]
						})

						cat = yield cat.save()

						movie.category = cat._id  //cat save以后会生成一个id
						yield movie.save()
					}
				})
			})

			co(function* () {
				yield cateArray
			})
		}
		else {
			movie.save()
		}
	})
}

exports.searchByDouban = function *(q) {
	var options = {
		url: 'https://api.douban.com/v2/movie/search?q='
	}

	options.url += encodeURIComponent(q)

	var response = yield koa_request(options)
	var data = JSON.parse(response.body)
	var subjects = []
	var movies = []

	if (data && data.subjects) {
		subjects = data.subjects
	}

	if (subjects.length > 0) {
		var queryArray = []

		subjects.forEach(function(item) {
			queryArray.push(function *() {
				var movie = yield Movie.findOne({doubanId: item.id})

				if (movie) {
					movies.push(movie)
				}
				else { //数据库中没有则存储
					var directors = item.directors || []
					var director = directors[0] || {}

					movie = new Movie({
						director: director.name || '',
						title: item.title,
						doubanId: item.id,
						poster: item.images.large,
						year: item.year,
						genres: item.genres || []
					})

					movie = yield movie.save()
					movies.push(movie)
				}
			})
		})

		yield queryArray

		movies.forEach(function(movie) {
			updateMovies(movie)
		})
	}

	return movies
}
