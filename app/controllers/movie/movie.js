'use strict';

var _ = require('lodash');
var Movie = require('../../models/movie/movie');
var Comment = require('../../models/movie/movie_comment');
var Category = require('../../models/movie/movie_category');
var fs = require('fs'); //系统级别读写文件的模块
var path = require('path');


//detail page
exports.detail = function *(next) {
	var id = this.params.id;

	yield Movie.update({_id: id}, {$inc: {pv: 1}}).exec();

	var movie = yield Movie.findOne({_id: id}).exec();

	var comments = yield Comment
  	.find({movie: id})
  	.populate('from', 'name')   //查找user集合里的name
  	.populate('reply.from reply.to', 'name')
  	.exec();

  yield this.render('pages/movie/movie_detail', {
  	title: 'movie 详情页',
  	movie: movie,
		logo: 'movie',
  	comments: comments
	});
};

//admin new page
exports.new = function *(next) {
	var categories = yield Category.find({}).exec();

	yield this.render('pages/movie/movie_admin', {
		title: 'movie 后台录入页',
		categories: categories,
		logo: 'movie',
		movie: {}
	});
};

// admin update movie
exports.update = function *(next) {
	var id = this.params.id;

	if (id) {
		var movie = yield Movie
				.findOne({_id: id})
				.populate('category', 'name')
				.exec();
		var categories = yield Category.find({}).exec();

		yield this.render('pages/movie/movie_admin', {
			title: 'movie 后台更新页',
			movie: movie,
			logo: 'movie',
			categories: categories
		});
	}
};

var util = require('../../../libs/util');

// admin poster
exports.savePoster = function *(next) {     //文件上传
	// 如果有文件上传通过koa-body中间件生成临时文件并通过this.request.body.files进行访问
	// 当提交表单中有文件上传请求时表单要使用enctype="multipart/form-data"编码格式
	var posterData = this.request.body.files.uploadPoster;       // 上传文件
	var filePath = posterData.path;                              // 文件路径
	var name = posterData.name;                                  // 原始名字

	if (name) {  //本地上传的
		var data = yield util.readFileAsync(filePath);
		var timestamp = Date.now();                                // 时间戳
		var type = posterData.type.split('/')[1];                  // 图片的种类
		var poster = timestamp + '.' + type;
		var newPath = path.join(__dirname, '../../../', '/public/upload/movie/' + poster);

		yield util.writeFileAsync(newPath, data);

		this.poster = poster;
	}
	
	yield next;
};

// admin movie
exports.saveMovie = function *(next) {     //文件上传
	// 如果有文件上传通过koa-body中间件生成临时文件并通过this.request.body.files进行访问
	// 当提交表单中有文件上传请求时表单要使用enctype="multipart/form-data"编码格式
	var movieData = this.request.body.files.uploadMovie;        // 上传电影文件
	var filePath = movieData.path;                              // 文件路径
	var name = movieData.name;                                  // 原始名字

	if (name) {  //本地上传的
		var data = yield util.readFileAsync(filePath);
		var newPath = path.join(__dirname, '../../../', '/public/media/movie/' + name);

		yield util.writeFileAsync(newPath, data);

		this.flash = name;  // 电影放映地址
	}
	yield next;
};

//后台录入控制器
exports.save = function *(next) {
	var movieObj = this.request.body.fields || {};
	var _movie;
	var categoryId = movieObj.category;         // 获取电影分类ID
	var categoryName = movieObj.categoryName;   // 获取新创建的电影分类名称
	var _categoryName;
	if (this.poster) {          // 如果有自定义上传海报  将movieObj中的海报地址改成自定义上传海报的地址
		movieObj.poster = this.poster;
	}
	if(this.flash) {              // 如果有自定义上传电影,则将本地地址传入
		movieObj.flash = this.flash;
	}

	if(movieObj._id) {  //如果数据已存在，则更新相应修改的字段
		var movie = yield Movie.findOne({_id: movieObj._id}).exec();
		if (movie.category) {       //如果刚开始类型有被选择的话
			if (movieObj.category.toString() !== movie.category.toString()) {  // 如果修改电影分类
				if (movieObj.category.length===24){           //分类选择改为只选择一个
					if (movie.category.length === 24){          //分类选择初始为一个
						_oldCat = yield Category.findOne({_id: movie.category}).exec();   // 在原电影分类的movies属性中找到该电影的id值并将其删除
						index = _oldCat.movies.indexOf(movieObj._id);
						_oldCat.movies.splice(index, 1);
						yield _oldCat.save();
						_newCat = yield Category.findOne({_id: categoryId}).exec(); // 找到电影对应的新电影分类
						_newCat.movies.push(movieObj._id);    // 将其id值添加到电影分类的movies属性中并保存
						yield _newCat.save();
					}else{    //分类选择初始为多个
						for(i = 0; i < movie.category.length; i++){   //遍历该电影的所有所属分类
							_oldCat = yield Category.findOne({_id: movie.category[i]}).exec();   // 在原电影分类的movies属性中找到该电影的id值并将其删除
							index = _oldCat.movies.indexOf(movieObj._id);
							_oldCat.movies.splice(index, 1);
							yield _oldCat.save();
						}
						_newCat = yield Category.findOne({_id: categoryId}).exec(); // 找到电影对应的新电影分类
						_newCat.movies.push(movieObj._id);    // 将其id值添加到电影分类的movies属性中并保存
						yield _newCat.save();
					}
				}else{       //分类选择改为选择多个
					for(var i = 0; i < movie.category.length; i++){   //遍历该电影的所有所属分类
						var _oldCat = yield Category.findOne({_id: movie.category[i]}).exec();   // 在原电影分类的movies属性中找到该电影的id值并将其删除
						var index = _oldCat.movies.indexOf(movieObj._id);
						_oldCat.movies.splice(index, 1);
						yield _oldCat.save();
					}
					for(i=0; i< categoryId.length; i++){     //遍历该电影新选择的所有分类
						var _newCat = yield Category.findOne({_id: categoryId[i]}).exec(); // 找到电影对应的新电影分类
						_newCat.movies.push(movieObj._id);    // 将其id值添加到电影分类的movies属性中并保存
						yield _newCat.save();
					}
				}
			}
		}else{       //如果刚开始类型一个也没有被选择的话
			if(movieObj.category.length > 0) {    //如果选择了分类
				for(i=0; i< categoryId.length; i++){     //遍历该电影新选择的所有分类
					_newCat = yield Category.findOne({_id: categoryId[i]}).exec(); // 找到电影对应的新电影分类
					_newCat.movies.push(movieObj._id);    // 将其id值添加到电影分类的movies属性中并保存
					yield _newCat.save();
				}
			}else {
				this.redirect('/admin/movie/list');
			}
		}

		_movie = _.extend(movie, movieObj);   //underscore换成lodash了
		yield _movie.save();

		this.redirect('/movie/' + _movie._id); //重定向
	}else if(movieObj.title) {
		// 查找该电影名称是否已存在
		_movie = yield Movie.findOne({title: movieObj.title}).exec();
		if (_movie && movieObj.director && movieObj.director === _movie.director) {
			console.log('电影已存在');
			this.redirect('/admin/movie/list');
		}else {      // 创建一个新电影数据
			_movie = new Movie(movieObj);
			if (categoryId) {      // 如果选择了电影所属的电影分类
				if(categoryId.length === 24){  //只选一个类别的时候,长度是24(ObjectId的长度)
					var category = yield Category.findOne({_id: categoryId}).exec();
					category.movies.push(_movie._id);
					yield category.save();
				}else{           // 多选类别
					for (var y=0; y<categoryId.length; y++) {
						var category = yield Category.findOne({_id: categoryId[y]}).exec();
						category.movies.push(_movie._id);
						yield category.save();
					}
				}
				yield _movie.save();
				this.redirect('/movie/' + _movie._id);
			}
			else if (categoryName) {       // 输入新的电影分类
				_categoryName = yield Category.findOne({name: categoryName}).exec();
				if (_categoryName) {
					console.log('电影分类已存在');
					this.redirect('/admin/category/list');
				}else {   //创建新的电影分类
					category = new Category({
						name: categoryName,
						movies: [_movie._id]
					});
					yield category.save();   // 保存新创建的电影分类
					_movie.category = category._id;  // 将新创建的电影保存，category的ID值为对应的分类ID值
					yield _movie.save();
					yield _movie.save();
					this.redirect('/movie/' + _movie._id);
				}
			}else{
				console.log('录制电影不成功,请选择分类');
				this.redirect('/admin/movie/new');
			}
		}
	}else if(categoryName) {     // 没有输入电影名称 而只输入了电影分类名称
		// 查找电影分类是否已存在
		_categoryName = yield Category.findOne({name: categoryName}).exec();
		if(_categoryName) {
			console.log('电影分类已存在');
			this.redirect('/admin/movie/category/list');
		}else{
			// 创建新的电影分类
			var newCategory = new Category({
				name: categoryName
			});
			// 保存新创建的电影分类
			yield newCategory.save();
			this.redirect('/admin/movie/category/list');
		}
	}else{  // 既没有输入电影名称也没输入分类,则数据录入失败
		console.log('既没有输入电影名称也没选择分类');
		this.redirect('/admin/movie/new');
	}
};

//list page
exports.list = function *(next) {
	var movies = yield Movie.find({})
		.populate('category', 'name')
		.exec();

  yield this.render('pages/movie/movie_list', {
  	title: 'movie 列表页',
  	movies: movies,
		logo: 'movie'
  });
};

//list delete movie
exports.del = function *(next) {
	var id = this.query.id;
	// 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
	if(id) {
		var movie = yield Movie.findOne({_id: id}).exec();
		for(var i=0; i < movie.category.length; i++) {
			var category = yield Category.findOne({_id: movie.category[i]});
			if (category) {
				var index = category.movies.indexOf(id);  // 在电影分类movies数组中查找该值所在位置
				category.movies.splice(index, 1);         // 从分类中删除该数据
				yield category.save();                    // 对变化的电影分类数据进行保存
			}
		}
		yield Movie.remove({_id: id});                // 电影模型中删除该电影数据
		this.body = {success: 1};                     // 返回删除成功的json数据给游览器
	}
};