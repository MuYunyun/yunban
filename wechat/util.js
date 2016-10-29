'use strict';

var xml2js = require('xml2js');
var Promise = require('bluebird');
var tpl = require('./tpl');

exports.parseXMLAsync = function(xml) {
	return new Promise(function(resolve, reject) {
		xml2js.parseString(xml, {trim: true}, function(err, content) {
			if (err) {reject(err);}
			else {resolve(content);}
		});
	});
};

function formatMessage(result) {
	var message = {};

	if (typeof result === 'object') {
		var keys = Object.keys(result); //拿到所有的keys

		for (var i = 0; i < keys.length; i++) {
			var item = result[keys[i]]; //拿到每个key对应的value
			var key = keys[i];

			if (!(item instanceof Array) || item.length === 0) {
				continue;
			}

			if (item.length === 1) {
				var val = item[0];

				if (typeof val === 'object') {
					message[key] = formatMessage(val);
				}
				else {
					message[key] = (val || '').trim(); //trim():拿掉首尾的空格
				}
			}
			else {  //是数组
				message[key] = [];  //设置为数组

				for (var j = 0, k = item.length; j < k; j++) {
					message[key].push(formatMessage(item[j]));
				}
			}
		}
	}

	return message;
}

exports.formatMessage = formatMessage;

exports.tpl = function(content, message) {
	var info = {};  //临时存储回复的内容
	var type = 'text';
	var fromUserName = message.FromUserName;
	var toUserName = message.ToUserName;

	if (Array.isArray(content)) {
		type = 'news';
	}

	if (!content) {
		content = 'Empty news';
	}

	type = content.type || type;
	info.content = content;
	info.createTime = new Date().getTime();
	info.msgType = type;
	info.toUserName = fromUserName;  //接受方账号
	info.fromUserName = toUserName;

	return tpl.compiled(info);
};