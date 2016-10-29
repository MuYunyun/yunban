'use strict';

var sha1 = require('sha1');
var getRawBody = require('raw-body');
var Wechat = require('./wechat');
var util = require('./util');

//中间件处理数据
module.exports = function(opts, handler){
	var wechat = new Wechat(opts); //管理和微信交互的接口

	return function *(next) {
		var that = this;
		var token = opts.token;				//加密的逻辑
		var signature = this.query.signature;
		var nonce = this.query.nonce;
		var timestamp = this.query.timestamp;
		var echostr = this.query.echostr;
		var str = [token, timestamp, nonce].sort().join('');
		var sha = sha1(str);

		if (this.method === 'GET') {  //验证是不是微信服务器过来的请求
			if (sha === signature) {
				this.body = echostr + '';
			}
			else {
				this.body = 'wrong';
			}			
		}
		else if (this.method === 'POST') {  //用户点击的事件或消息推送给我们
			if (sha !== signature) {
				this.body = 'wrong';
				return false;
			}

			var data = yield getRawBody(this.req, {  //获取原始XML数据
				length: this.length,
				limit: '1mb',
				encoding: this.charset
			});

			var content = yield util.parseXMLAsync(data);

			var message = yield util.formatMessage(content.xml);

			console.log(message);

			this.weixin = message;

			yield handler.call(this, next); //暂停这里，走向外层逻辑

			wechat.reply.call(this);
		}
	};
};








