'use strict';

var path = require('path');
var Movie = require('../app/api/movie');
var Music = require('../app/api/music');
var wx = require('./index.js');
var wechatApi = wx.getWechat();

var help = '亲，欢迎关注☁瓣微信公众号\n' +
		'回复1，分享每日一图\n' +
		'回复2，聆听每日一曲\n' +
		'回复3，查看云瓣理念\n' +
		'输入"电影名字"，可以查询电影信息\n' +
		'也通过语音输入，查询电影信息\n' +
		'点击<a href="http://www.wukunyao.cn/">这里</a> ，可进入云瓣首页\n';

exports.reply = function* (next) {
	var message = this.weixin;

	if (message.MsgType === 'event') {
		if (message.Event === 'subscribe') {
			this.body = help;
		}
		else if (message.Event === 'unsubscribe') {
			console.log('无情取关');
			this.body = '';
		}
		else if (message.Event === 'LOCATION') {
			this.body = '您上报的位置是： ' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
		}
		else if (message.Event === 'CLICK') {
			var news = [];

			if (message.EventKey === 'movie_hot') {        // 电影Top10
				let movies = yield Movie.findHotMovies(-1, 10);
				movies.forEach(function(movie) {
					if (movie.poster.indexOf('http') > -1){
						var picUrl = movie.poster;
					}
					else{
						picUrl = path.join(__dirname, '../upload/movie'+ movie.poster);
						//console.log(picUrl);   // 这里有个Bug,自己上传的图片显示不出来
					}
					news.push({
						title: movie.title,
						description: movie.title,
						picUrl: picUrl,
						url: 'http://www.wukunyao.cn/wechat/jump/' + movie._id
					})
				})
			}
			else if (message.EventKey === 'music_hot') {       // 音乐Top10
				let musics = yield Music.findHotMusics(-1, 10);

				musics.forEach(function(music) {
					news.push({
						title: music.title,
						description: music.title,
						picUrl: music.poster,
						url: 'http://www.wukunyao.cn/wechat/jumpMusic/' + music._id
					})
				})
			}
			else if (message.EventKey === 'movie_classic') {        //经典电影
				let cat = yield Movie.findMoviesByCate('经典电影');
				cat.movies.forEach(function(movie) {
					news.push({
						title: movie.title,
						description: movie.title,
						picUrl: movie.poster,
						url: 'http://www.wukunyao.cn/wechat/jump/' + movie._id
					})
				})
			}else if (message.EventKey === 'music_classic') {         //经典音乐
				let cat = yield Music.findMusicsByCate('云瓣音乐250');

				cat.musics.forEach(function(music) {
					news.push({
						title: music.title,
						description: music.title,
						picUrl: music.poster,
						url: 'http://www.wukunyao.cn/wechat/jumpMusic/' + music._id
					})
				})
			}else if (message.EventKey === 'music_recommend') {         //小编推荐曲目
				let cat = yield Music.findMusicsByCate('编辑推荐');

				cat.musics.forEach(function(music) {
					news.push({
						title: music.title,
						description: music.title,
						picUrl: music.poster,
						url: 'http://www.wukunyao.cn/wechat/jumpMusic/' + music._id
					})
				})
			}else if (message.EventKey === 'help') {
				news = help;
			}

			this.body = news;
		}
	}
	else if (message.MsgType === 'voice') {
		var voiceText = message.Recognition;
		var movies = yield Movie.searchByName(voiceText);

			if (!movies || movies.length === 0) {
				movies = yield Movie.searchByDouban(voiceText);
			}

			if (movies.length > 0 && movies) {
				reply = [];

				movies = movies.slice(0, 10);

				movies.forEach(function(movie) {
					reply.push({
						title: movie.title,
						description: movie.title,
						picUrl: movie.poster,
						url: 'http://www.wukunyao.cn/wechat/jump/' + movie._id
					})
				})
			}
			else {
				reply = '没有查询到与 ' + content + ' 匹配的电影，换一个试试？';
			}

			this.body = reply;
	}	
	else if (message.MsgType === 'text') {
		var content = message.Content;
		var reply = '额，你说的 ' + message.Content + ' 太复杂了';

		if (content === '1') {  // 每日一图
			var data = yield wechatApi.uploadMaterial('image', path.join(__dirname, '../1.jpg'));
			reply = {
				type: 'image',
				mediaId: data.media_id
			}
		}else if (content === '2') {   // 每日一曲
			var data = yield wechatApi.uploadMaterial('image', path.join(__dirname, '../2.jpg'));
			reply = {
				type: 'music',
				title: '《前世情人》',
				description: '云云最爱听的歌',
				musicUrl: 'http://link.hhtjim.com/163/415792918.mp3',
				thumbMediaId: data.media_id
			}
		}else if (content === '3') {
			var picData = yield wechatApi.uploadMaterial('image', path.join(__dirname, '../1.jpg'), {})
			var media = {
				articles: [{
					title: '欢迎来到云瓣影音',
					thumb_media_id: picData.media_id,
					author: '牧云云',
					digest: '云瓣小世界,人生大舞台',
					show_cover_pic: 1,
					content: '在这里，我们一起努力，一起工作，一起成功，一起失败。我们将在一次又一次的活动中，在一天又一天的相处中，结识你身边的人，了解你身边的事，学会你渴望学到的经验，经历你渴望经历的精彩。'+
					'欢迎加入云瓣大家庭!',
					content_source_url: 'https://github.com/MuYunyun/yunban'
				}]
			};

			data = yield wechatApi.uploadMaterial('news', media, {});
			data = yield wechatApi.fetchMaterial(data.media_id, 'news', {});

			var items = data.news_item;
			var news = [];
			items.forEach(function(item) {
				news.push({
					title: item.title,
					description: item.digest,
					picUrl: picData.url,
					url: item.url
				})
			});

			reply = news
		}
		else {
			var movies = yield Movie.searchByName(content);

			if (!movies || movies.length === 0) {
				movies = yield Movie.searchByDouban(content);
			}

			if (movies && movies.length > 0) {
				reply = [];

				movies = movies.slice(0, 10);
				movies.forEach(function(movie) {
					reply.push({
						title: movie.title,
						description: movie.title,
						picUrl: movie.poster,
						url: 'http://www.wukunyao.cn/wechat/jump/' + movie._id
					})
				})
			}
			else {
				reply = '没有查询到与 ' + content + ' 匹配的电影，换一个试试？';
			}
		}

		this.body = reply;
	}

	yield next
};