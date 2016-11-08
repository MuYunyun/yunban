'use strict';

var Movie = require('../../api/movie');

var mongoose = require('mongoose'),
		City = mongoose.model('City'),                     // 引入电影院城市模型
		CityProgramme = mongoose.model('CityProgramme'),   // 电影院城市分类归档模型
		CityCategory = mongoose.model('CityCategory'),     // 电影院城市分类模型
		Category = mongoose.model('Category');             // 电影分类模型

// index page
exports.index = function *(next) {
	var _cityName = this.request.query.cityName,    // 电影院所在城市
			_searchName = this.request.query.search,    // 影院搜索框输入的电影院名称
			_galleryName = this.request.query.galleryName, // 获取正在上映和即将上映播放标题名
			_fliterName = this.request.query.fliterName,   // 选电影/选电视剧分类标题名称
			_catName = this.request.query.catName,         // 获取点击加载更多时的类别
			_sort = this.request.query.sortName;               // 选电影排序种类

	// 如果是电影院搜索框中发送了Ajax请求
	if(_cityName) {
		// 通过城市名查找该城市对应的电影院
		var searchResults = yield City.findOne({name: _cityName}).exec();
		var results = [];
		if (searchResults) {
			var searchCinemas = searchResults.cinemas;    // 获取该城市的电影院列表
			if(_searchName) {     // 通过循环将输入的影院名与该城市所有的电影院进行对比，返回匹配成功的影院
				searchCinemas.forEach(function(each) {
					if(each.match(_searchName)) {
						results.push(each);
					}
				});
			}else {  //返回该城市对应的全部电影院列表
				results = searchCinemas;
			}
			this.body = results;
		}
	}else if(_galleryName){    // 顶部正在上映和即将上映电影展示区切换
		var category = yield Category
				.findOne({name: _galleryName})
				.populate('movies','title poster')
				.exec();
		this.body = category;
	}else if(_fliterName){     // 如果是选电影/选电视剧区发送的分类切换请求(默认是按热度排序)
		var category = yield Category
				.findOne({name:_fliterName})
				.populate({
					path:'movies',
					select:'title poster rating pv',
					options: {limit: 20,sort: {pv:-1}}
				})
				.exec();
		this.body = ({data:category});
	}else if(_catName){        // 点击加载更多
		var num = parseInt(this.request.query.p, 10);   //点击加载更多的次数
		var checkedName = this.request.query.checkedName; //获取排序种类
		if (num) {
			var category = yield Category
					.findOne({name: _catName})
					.populate({
						path: 'movies',
						select: 'title poster pv year rating',
						options: {sort: {[checkedName]: -1}}
					})
					.exec();
			var movies = category.movies || [];
			var length = movies.length;    //该类下电影总数量
			var total = length - num*20;       //剩下的电影数量
			if (total < 20){  //最后一次点击
				results = movies.slice(20*num,20*num+total);
			}else{            //非最后一次点击
				results = movies.slice(20*num,20*num+20);
			}
			this.body = results;  // 加载的电影
		}
	}else if(_sort){   //选电影排序
		var _category = this.request.query.category;           // 选电影排序时的类别
		if(_sort === 'pv'){                       //按热度排序
			var categories = yield Category
					.findOne({name: _category})
					.populate({
						path: 'movies',
						select: 'title poster pv year rating',
						options: {limit: 20,sort: {pv:-1}}
					})
					.exec();
		}else if(_sort === 'year'){               //按时间排序
			categories = yield Category
					.findOne({name: _category})
					.populate({
						path: 'movies',
						select: 'title poster pv year rating',
						options: {limit: 20,sort: {year:-1}}
					})
					.exec();
		}else{                                   //按评价排序
			categories = yield Category
					.findOne({name: _category})
					.populate({
						path: 'movies',
						select: 'title poster pv year rating',
						options: {limit: 20,sort: {rating:-1}}
					})
					.exec();
		}
		var movies = categories.movies || [];
		this.body = movies;
	}else {         // 没有发送上面请求的则渲染云瓣电影主页
		var categories = yield Category
				.find({})
				.populate({
					path: 'movies',
					select: 'title poster pv rating',
					options: {limit: 20,sort: {pv:-1}}
				})
				.exec();
		var cinemas = yield City.find({}).exec();
		var cityProgrammeList = yield CityProgramme.find({})
				.populate('cityCategories', 'name')
				.exec();
		var cityCategoryList = yield CityCategory.find({})
				.populate('cities', 'name')
				.populate('cityProgramme', 'name')
				.exec();
		yield this.render('pages/movie/movie_index', {
			title: '云瓣电影首页',
			logo: 'movie',
			categories: categories,
			cinemas: cinemas,
			cityProgrammeList: cityProgrammeList,
			cityCategoryList: cityCategoryList
		});
	}
};

/* 首页电影分类及电影搜索 */
exports.search = function *(next) {
	var q = this.query.q;                             // 获取搜索框提交内容
	var page = parseInt(this.query.p, 10) || 0;       // 获取页面
	var count = 6;             //每页展示的数据
	var index = page * count;  //索引的开始位置
	var categories = yield Movie.searchByCategory(q);
	var category = categories[0] || {};                    // 查询到的电影分类
	var categories2 = yield Movie.searchByCategory(q+'电影');
	var category2 = categories2[0] || {};                    // 查询到的电影分类
	if (category.name) {
		var movies = category.movies || [];                    // 分类中包含的电影
		var results = movies.slice(index, index + count);      // 分类页面每页显示的电影数量

		yield this.render('pages/movie/movie_results', {
			title: '云瓣电影结果列表页面',
			logo:'movie',                                        //显示电影logo
			keyword: category.name,                              // 分类名称
			currentPage: (page + 1),                             // 当前页
			query: 'q=' + q,                                     // 分类名称
			totalPage: Math.ceil(movies.length / count),         // 总页数，需向上取整
			movies: results                                      // 查询到电影分类下所含的电影
		});
	}else if(category2.name){
		movies = category2.movies || [];                    // 分类中包含的电影
		results = movies.slice(index, index + count);      // 分类页面每页显示的电影数量
		yield this.render('pages/movie/movie_results', {
			title: '云瓣电影结果列表页面',
			logo:'movie',                                        //显示电影logo
			keyword: category2.name,                              // 分类名称
			currentPage: (page + 1),                             // 当前页
			query: 'q=' + q,                                     // 分类名称
			totalPage: Math.ceil(movies.length / count),         // 总页数，需向上取整
			movies: results                                      // 查询到电影分类下所含的电影
		});
	}else {                                       //对单独电影进行搜索
		movies = yield Movie.searchByName(q);
		var num = movies.length || 0;
		results = movies.slice(index, index + count);

		  yield this.render('pages/movie/movie_results', {
		  	title: '云瓣电影搜索结果列表页面',
				logo:'movie',
		  	keyword: '共找到'+ num +'条与"' + q + '"相关的电影',
		  	currentPage: (page + 1),
		  	query: 'q=' + q,
		  	totalPage: Math.ceil(movies.length / count),
		  	movies: results
		  });
		}
	};

	//电影广告链接页面
exports.fullpage = function *(next) {
	yield this.render('pages/movie/movie_fullpage', {
		title: '云瓣电影广告页面'
	});
};
