'use strict';

var MovieIndex = require('../app/controllers/movie/movie_index');      // 电影首页控制器
var Movie = require('../app/controllers/movie/movie');                 // 电影模块路由控制器
var MovieComment = require('../app/controllers/movie/movie_comment');  // 电影评论控制器
var City = require('../app/controllers/movie/movie_city');             // 电影院分类控制器
var Category = require('../app/controllers/movie/movie_category');     // 电影分类控制器

var MusicIndex = require('../app/controllers/music/music_index');      // 音乐首页控制器
var Music = require('../app/controllers/music/music');
var MusicCategory = require('../app/controllers/music/music_category'); //音乐分类控制器

var User = require('../app/controllers/user/user');    //用户模块路由控制器

var Game = require('../app/controllers/wechat/game');
var Wechat = require('../app/controllers/wechat/wechat');

var koaBody = require('koa-body');

module.exports = function(router) {
	/*============ 公共路由 =============*/
	// 用户注册路由
	router.get('/signup', User.showSignup);
	router.post('/user/signup', User.signup);
	// 用户登录路由
	router.get('/signin', User.showSignin);
	router.post('/user/signin', User.signin);
	// 用户登出路由
	router.get('/logout', User.logout);
	// 验证码路由
	router.get('/captcha', User.captcha);
	// 用户列表路由
	router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
	router.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del);

	/*============ 豆瓣电影网站路由 ============*/
	// 电影主页路由
	router.get('/movieIndex', MovieIndex.index);
	// 首页电影搜索结果页
	router.get('/movie/results', MovieIndex.search);
	// 电影广告页(网站首页)
	router.get('/', MovieIndex.fullpage);
	// 电影详细页面路由
	router.get('/movie/:id', Movie.detail);
	router.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
	router.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
	router.post('/admin/movie', User.signinRequired, User.adminRequired, koaBody({multipart: true}), Movie.savePoster, Movie.save);
	router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
	router.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

	// 用户评论路由
	router.post('/user/comment', User.signinRequired, MovieComment.save);
	router.delete('/user/comment/:id', User.signinRequired, MovieComment.del);

	// 电影分类列表页路由
	router.get('/admin/movie/category/new', User.signinRequired, User.adminRequired, Category.new);
	router.post('/admin/movie/category', User.signinRequired, User.adminRequired, Category.save);
	router.get('/admin/movie/category/list', User.signinRequired, User.adminRequired, Category.list);
	router.delete('/admin/movie/category/list', User.signinRequired, User.adminRequired, Category.del);

	// 电影院搜索路由
	router.get('/admin/city/new', User.signinRequired, User.adminRequired, City.new);
	router.post('/admin/city/new', User.signinRequired, User.adminRequired, City.save);
	router.get('/admin/city/list', User.signinRequired, User.adminRequired, City.list);
	router.delete('/admin/city/list', User.signinRequired, User.adminRequired, City.del);


	/*============ 豆瓣音乐网站路由 ============*/
	// 音乐主页路由
	router.get('/musicIndex', MusicIndex.index);

	// 音乐详细页面路由
	router.post('/admin/music', User.signinRequired, User.adminRequired, koaBody({multipart: true}), Music.savePoster, Music.save);
	router.get('/admin/music/new', User.signinRequired, User.adminRequired, Music.new);
	router.get('/admin/music/list', User.signinRequired, User.adminRequired, Music.list);
	router.delete('/admin/music/list', User.signinRequired, User.adminRequired, Music.del);

	// 音乐分类列表页路由
	router.get('/admin/music/category/new', User.signinRequired, User.adminRequired, MusicCategory.new);
	router.post('/admin/music/category', User.signinRequired, User.adminRequired, MusicCategory.save);
	router.get('/admin/music/category/list', User.signinRequired, User.adminRequired, MusicCategory.list);
	router.delete('/admin/music/category/list', User.signinRequired, User.adminRequired, MusicCategory.del);

	// wechat
	router.get('/wechat/movie', Game.guess);
	router.get('/wechat/movie/:id', Game.find);
	router.get('/wechat/jump/:id', Game.jump);
	router.get('/wx', Wechat.hear);
	router.post('/wx', Wechat.hear);
};
