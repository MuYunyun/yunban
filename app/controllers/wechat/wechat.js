'use strict';

var wechat = require('../../../wechat/g');  //koa的中间件
var reply = require('../../../wx/reply');  //回复文件
var wx = require('../../../wx/index');  //获取微信实例

exports.hear = function *(next) {
	this.middle = wechat(wx.wechatOptions.wechat, reply.reply);

	yield this.middle(next);
};