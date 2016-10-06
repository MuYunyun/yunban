var Movie = require('../models/movie')
var Category = require('../models/category')

// index page
exports.index = function(req, res) {
	Category
		.find({})
		.populate({
			path: 'movies',
			select: 'title poster',
			options: { limit: 6 }
		})
		.exec(function(err, categories) {
			if (err) {
				console.log(err)
			}
		  res.render('index', {
		  	title: 'movie 首页',
		  	categories: categories
		  })
		})
}

// search page
exports.search = function(req, res) {
	var catId = req.query.cat
	var q = req.query.q
	var page = parseInt(req.query.p, 10) || 0
	var count = 2
	var index = page * count  //索引的开始位置

	if (catId) {
		Category
			.find({_id: catId})
			.populate({
				path: 'movies', 
				select: 'title poster',
				//options: { limit: 2, skip: index } //每次查询的个数，从哪个位置开始查
			})
			.exec(function(err, categories) {
				if (err) {
					console.log(err)
				}
				var category = categories[0] || {}
				var movies = category.movies || []
				var results = movies.slice(index, index + count)

			  res.render('results', {
			  	title: 'movie 结果列表页面',
			  	keyword: category.name,
			  	currentPage: (page + 1),
			  	query: 'cat=' + catId,
			  	totalPage: Math.ceil(movies.length / count),
			  	movies: results
			  })
			})
	}
	else {
		Movie
			.find({title: new RegExp(q+ '.*', 'i')})
			.exec(function(err, movies) {
				if (err) {
					console.log(err)
				}

				var results = movies.slice(index, index + count)

			  res.render('results', {
			  	title: 'movie 结果列表页面',
			  	keyword: q,
			  	currentPage: (page + 1),
			  	query: 'q=' + q,
			  	totalPage: Math.ceil(movies.length / count),
			  	movies: results
			  })
			})
			}
	}
