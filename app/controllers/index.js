'use strict'

var Movie = require('../api/movie')

// index page
exports.index = function *(next) {
	var categories = yield Movie.findAll()

	yield this.render('pages/index', {
		title: 'movie 首页',
		categories: categories
	})
}

// search page
exports.search = function *(next) {
	var catId = this.query.cat
	var q = this.query.q
	var page = parseInt(this.query.p, 10) || 0
	var count = 2
	var index = page * count  //索引的开始位置

	if (catId) {
		var categories = yield Movie.searchByCategory(catId)	
		var category = categories[0] || {}
		var movies = category.movies || []
		var results = movies.slice(index, index + count)

	  yield this.render('pages/results', {
	  	title: 'movie 结果列表页面',
	  	keyword: category.name,
	  	currentPage: (page + 1),
	  	query: 'cat=' + catId,
	  	totalPage: Math.ceil(movies.length / count),
	  	movies: results
	  })
	}
	else {
		var movies = yield Movie.searchByName(q)		
			var results = movies.slice(index, index + count)

		  yield this.render('pages/results', {
		  	title: 'movie 结果列表页面',
		  	keyword: q,
		  	currentPage: (page + 1),
		  	query: 'q=' + q,
		  	totalPage: Math.ceil(movies.length / count),
		  	movies: results
		  })
		}
	}
