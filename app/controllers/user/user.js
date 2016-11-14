'use strict';

var User = require('../../models/user/user');
var ccap = require('ccap')();
var captcha;
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var MusicComment = mongoose.model('MusicComment');

// 用户注册及登录框中验证码生成器控制器
exports.captcha = function *(next) {
	if (this.request.url === '/favicon.ico') {
		this.body = '';
	}
	var ary = ccap.get();
	captcha = ary[0];
	// 生成验证码
	this.body = captcha;
};

// signup
exports.showSignup = function *(next) {
  yield this.render('pages/user/signup', {
  	title: '注册页面',
		logo: 'movie'
  });
};

// signin
exports.showSignin = function *(next) {
  yield this.render('pages/user/signin', {
  	title: '登录页面',
		logo: 'movie'
  });
};

// 注册页面
exports.signup =  function *(next) {
	var use = this.request.body.user;  //获取表单的数据
	var _user = {};
	use = use.split('&');
	for(var i = 0; i < use.length; i++){
		var p = use[i].indexOf('='),
				name = use[i].substring(0,p),
				value = decodeURI(use[i].substring(p+1));
		_user[name] = value;
	}
	var _name = _user.name || '',
  	  _captcha = _user.captcha || '';
  var user = yield User.findOne({name: _name}).exec();
	if (user) {
		this.body = {data:0};
	}
	else{
		if (captcha) {  //验证码存在
			if(_captcha.toLowerCase() !== captcha.toLowerCase()) {
				this.body = {data:1};
			}
			else {
				user = new User(_user);     // 生成用户数据
				yield user.save();
				this.session.user = user;    // 将当前登录用户名保存到session中
				this.body = {data:2};
				this.redirect('/');
			}
		}
  }
};

// 登录页面
exports.signin = function *(next) {
	var use = this.request.body.user;  //获取表单的数据
	var _user = {};
	use = use.split('&');
	for(var i = 0; i < use.length; i++){
		var p = use[i].indexOf('='),
				name = use[i].substring(0,p),
				value = decodeURI(use[i].substring(p+1));
		_user[name] = value;
	}
	var _name = _user.name || '',
			_password = _user.password || '',
			_captcha = _user.captcha || '';

	var user = yield User.findOne({name: _name}).exec();

	if(!user) {
		this.body = {data:0};     //用户不存在
	}
	else {
		var isMatch = yield user.comparePassword(_password, user.password);
		//密码匹配
		if (isMatch) {
			if (captcha) {   //验证码存在
				if (_captcha.toLowerCase() !== captcha.toLowerCase()) {
					this.body = {data: 2};             //输入的验证码不相等
				} else {
					this.session.user = user;        // 将当前登录用户名保存到session中
					this.body = {data: 3};            // 登录成功
				}
			}
		} else {     //账户名和密码不匹配
			this.body = {data: 1};
		}
	}
};

// logout
exports.logout = function *(next) {
	delete this.session.user;
	this.redirect('/movieIndex');
};

// userlist page
exports.list = function *(next) {
	var users = yield User
		.find({})
		.sort('meta.updateAt')
		.exec();

  yield this.render('pages/user/userlist', {
  	title: '云瓣电影用户列表页',
		logo: 'movie',
  	users: users
  });
};

/* 用户列表删除电影控制器 */
exports.del = function *(next) {
	// 获取客户端Ajax发送的URL值中的id值
	var id = this.query.id;
	if (id) {
		// 删除用户的同时删除与该用户所有相关的电影评论
		yield Comment.remove({from: id}).exec();  //删除非叠楼里的该用户的评论
		var comment = yield Comment.find({}).exec();     //删除叠楼里的该用户的评论
		var len = comment.length;
		for(var i=0; i < len; i++){
			var leng = comment[i].reply.length;
			for(var y=0; y < leng; y++){
				if(comment[i].reply[y].from == id || comment[i].reply[y].to == id){
					comment[i].reply.splice(y, 1);
					y--;   //因为删掉了一个,所以索引提前,
					leng--;  //总数也相应减少;
				}
				yield comment[i].save();
			}
		}

		// 删除用户的同时删除与该用户所有相关的音乐评论
		yield MusicComment.remove({from: id}).exec();  //删除非叠楼里的该用户的评论
		var musicComment = yield MusicComment.find({}).exec();     //删除叠楼里的该用户的评论
		var len = musicComment.length;
		for(var i=0; i < len; i++){
			var leng = musicComment[i].reply.length;
			for(var y=0; y < leng; y++){
				if(musicComment[i].reply[y].from == id || musicComment[i].reply[y].to == id){
					musicComment[i].reply.splice(y, 1);
					y--;   //因为删掉了一个,所以索引提前,
					leng--;  //总数也相应减少;
				}
				yield musicComment[i].save();
			}
		}

		// 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
		yield User.remove({_id:id});
		this.body = ({success:1});     // 删除成功
	}
};

// midware for user
exports.signinRequired = function *(next) {
	var user = this.session.user;

	if (!user) {
		this.redirect('/signin');
	}
	else {
		yield next;
	}
};

exports.adminRequired = function *(next) {
	var user = this.session.user;

	if (user.role <= 10) {
		this.redirect('/signin');
	}
	else {
		yield next;
	}
};