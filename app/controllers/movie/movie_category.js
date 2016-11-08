'use strict';

var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Movie = mongoose.model('Movie');

// admin new page
exports.new = function *(next) {
	yield this.render('pages/movie/movie_category_admin', {
		title: '云瓣后台分类录入页',
		logo: 'movie',
		category: {}
	});
};

// 电影分类存储控制器
exports.save = function *(next) {
	var category = this.request.body.category;
	// 判断新创建的电影分类是否已存在，避免重复输入
	var _category =  yield Category.findOne({name:category.name}).exec();
	if(_category) {
		console.log('电影分类已存在');
		this.redirect('/admin/movie/category/new');
	}else {
		 category = new Category(category);
		 yield category.save();
		 this.redirect('/admin/movie/category/list');
	  }
};

// 电影分类控制器
exports.list = function *(next) {
	// 通过movies属性查找电影分类所对应的电影名称
	var categories = yield Category.find({}).populate({path:'movies',select:'title'}).exec();
  yield this.render('pages/movie/movie_category_list', {
  	title: '云瓣电影分类列表页',
  	categories: categories,
		logo: 'movie'
  });
};

// 电影分类列表删除控制器
exports.del = function *(next) {
	var id = this.request.query.id;
	if(id) {
		var category = yield Category.findOne({_id: id}).exec();
		for (var i=0; i < category.movies.length; i++){
			var movie = yield Movie.findOne({_id: category.movies[i]}).exec();
			if (movie) {
				var index = movie.category.indexOf(id);         // 在电影分类category数组中查找该值所在位置
				movie.category.splice(index, 1);                // 从分类中删除该数据
				yield movie.save();                             // 对变化的电影分类数据进行保存
			}
		}
		yield Category.remove({_id: id});                   // 电影分类模型中删除该分类数据
		this.body = {success:1};                            // 返回删除成功的json数据给游览器
	}
};

