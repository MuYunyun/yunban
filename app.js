var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var port = process.env.PORT || 3000
var app = express()
var bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public'))) //静态文件配置的目录
app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port ' + port)

//index page
app.get('/', function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
	  res.render('index', {
	  	title: 'imooc 首页',
	  	movies: movies
	  })
	})
})

//detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id

	Movie.findById(id, function(err, movie) {
	  res.render('detail', {
	  	title: 'imooc ' + movie.title,
	  	movie: movie
 		})
  })
})

//admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})

// admin update movie
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id

	if (id) {
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie 
			})
		})
	}
})

// admin post movie
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined') {  //对其更新
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)   //underscore
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)  //重定向
			})
    })
	}
	else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}

			res.redirect('/movie/' + movie._id)
		})
	}
})


//list page
app.get('/admin/list', function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}

	  res.render('list', {
	  	title: 'imooc 列表页',
	  	movies: movies
	  })
	})
})

//list delete movie
app.delete('/admin/list', function(req, res) {
	var id = req.query.id

	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err)
			}
			else {
				res.json({success: 1})
			}
		})
	}
})









