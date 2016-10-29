'use strict';

var path = require('path');
var util = require('../libs/util');
var Wechat = require('../wechat/wechat');
var wechat_file = path.join(__dirname, '../config/wechat.txt');
var wechat_ticket_file = path.join(__dirname, '../config/wechat_ticket.txt');
var config = {
	wechat: {
		appID: 'wx87ca9022ab0f61fe',
		appsecret: 'f559ce0c07b77c0dd123b96181c12477',
		token: 'tolearnwechat',
		getAccessToken: function() {
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken: function(data) {
			data = JSON.stringify(data);
			return util.writeFileAsync(wechat_file, data);
		},
		getTicket: function() {
			return util.readFileAsync(wechat_ticket_file);
		},
		saveTicket: function(data) {
			data = JSON.stringify(data);
			return util.writeFileAsync(wechat_ticket_file, data);
		}
	}
};

exports.wechatOptions = config;

exports.getWechat = function() {  //构造函数的实例化
	var wechatApi = new Wechat(config.wechat);

	return wechatApi;
};