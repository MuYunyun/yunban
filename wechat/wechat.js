'use strict'


var Promise = require('bluebird')
var _ = require('lodash')
var request = Promise.promisify(require('request')) //request进行promise化
var util = require('./util')
var fs = require('fs')
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var mpPrefix = 'https://mp.weixin.qq.com/cgi-bin/'
var semanticUrl = 'https://api.weixin.qq.com/semantic/semproxy/search?'
var api = {
	semanticUrl: semanticUrl,
	accessToken: prefix + 'token?grant_type=client_credential',
	temporary: {
		upload: prefix + 'media/upload?',
		fetch: prefix + 'media/get?'
	},
	permanent: {
		upload: prefix + 'material/add_material?',
		fetch: prefix + 'material/get_material?',
		uploadNews: prefix + 'material/add_news?',  //图文
		uploadNewsPic: prefix + 'media/uploadimg?',  //图文消息的图片
		del: prefix + 'material/del_material?',
		update: prefix + 'material/update_news?',
		count: prefix + 'material/get_materialcount?',
		batch: prefix + 'material/batchget_material?',
		
	},
	tag: {  //用户标签管理
		create: prefix + 'tags/create?',
		fetch: prefix + 'tags/get?',
		update: prefix + 'tags/update?',
		delete: prefix + 'tags/delete?',
		tagget: prefix + 'user/tag/get?',  //获取标签下粉丝列表
		batchtag: prefix + 'tags/members/batchtagging?', //批量为用户打标签
		batchuntag: prefix + 'tags/members/batchuntagging?', //批量为用户取消标签
		check: prefix + 'tags/getidlist?' //获取用户身上的标签列表
	},
	user: {
		remark: prefix + 'user/info/updateremark?',
		fetch: prefix + 'user/info?',		//获取用户基本信息
		batFetch: prefix + 'user/info/batchget?',  //获取用户基本信息
		list: prefix + 'user/get?'   //获取用户列表
	},
	mass: {  //群发
		tag: prefix + 'message/mass/sendall?',
		openId: prefix + 'message/mass/send?',
		del: prefix + 'message/mass/delete?',
		preview: prefix + 'message/mass/preview?',
		check: prefix + 'message/mass/get?'
	},
	menu: {
		create: prefix + 'menu/create?',
		get: prefix + 'menu/get?',
		del: prefix + 'menu/delete?',
		current: prefix + 'get_current_selfmenu_info?' //获取自定义菜单配置接口
	},
	qrcode: {
		create: prefix + 'qrcode/create?',
		show: mpPrefix + 'showqrcode?'
	},
	shortUrl: {
		create: prefix + 'shorturl?'
	},
	ticket: {
		get: prefix + 'ticket/getticket?'
	}
}

function Wechat(opts) {
	var that = this
	this.appID = opts.appID
	this.appsecret = opts.appsecret
	this.getAccessToken = opts.getAccessToken  //读取票据的方法
	this.saveAccessToken = opts.saveAccessToken //存储票据的方法
	this.getTicket = opts.getTicket
	this.saveTicket = opts.saveTicket

	this.fetchAccessToken()

}

Wechat.prototype.fetchAccessToken = function(data) {
	var that = this


	return this.getAccessToken()
		.then(function(data) {
			try {
				data = JSON.parse(data)
			}
			catch(e) {
				return that.updateAccessToken()
			}

			if (that.isValidAccessToken(data)) {  //有效
				return Promise.resolve(data)
			}
			else {
				return that.updateAccessToken()
			}
		})
		.then(function(data) {
			that.saveAccessToken(data)

			return Promise.resolve(data)
		})
}

Wechat.prototype.fetchTicket = function(access_token) {
	var that = this


	return this.getTicket()
		.then(function(data) {
			try {
				data = JSON.parse(data)
			}
			catch(e) {
				return that.updateTicket(access_token)
			}

			if (that.isValidTicket(data)) {  //有效
				return Promise.resolve(data)
			}
			else {
				return that.updateTicket(access_token)
			}
		})
		.then(function(data) {
			that.saveTicket(data)

			return Promise.resolve(data)
		})
}

Wechat.prototype.isValidAccessToken = function(data) {
	if (!data || !data.access_token || !data.expires_in) {
		return false
	}

	var access_token = data.access_token
	var expires_in = data.expires_in
	var now = (new Date().getTime())

	if (now < expires_in) {
		return true
	}
	else {
		return false
	}
}

Wechat.prototype.isValidTicket = function(data) {
	if (!data || !data.ticket || !data.expires_in) {
		return false
	}

	var ticket = data.ticket
	var expires_in = data.expires_in
	var now = (new Date().getTime())

	if (ticket && now < expires_in) {
		return true
	}
	else {
		return false
	}
}


Wechat.prototype.updateAccessToken = function() {
	var appID = this.appID
	var appsecret = this.appsecret
	var url = api.accessToken + '&appid=' + appID + '&secret=' + appsecret

	return new Promise(function(resolve, reject) {
		request({url: url, json: true}).then(function(response) {
			var data = response.body
			var now = (new Date().getTime())
			var expires_in = now + (data.expires_in - 20) * 1000

			data.expires_in = expires_in

			resolve(data)
		})
	})
}

Wechat.prototype.updateTicket = function(access_token) {
	var url = api.ticket.get + '&access_token=' + access_token + '&type=jsapi'

	return new Promise(function(resolve, reject) {
		request({url: url, json: true}).then(function(response) {
			var data = response.body
			var now = (new Date().getTime())
			var expires_in = now + (data.expires_in - 20) * 1000

			data.expires_in = expires_in

			resolve(data)
		})
	})
}

Wechat.prototype.uploadMaterial = function(type, material, permanent) {
	var that = this
	var form = {}
	var uploadUrl = api.temporary.upload

	if (permanent) {
		uploadUrl = api.permanent.upload

		_.extend(form, permanent)  //让form兼容所有上传消息
	}

	if (type === 'pic') {
		uploadUrl = api.permanent.uploadNewsPic
	}

	if (type === 'news') {
		uploadUrl = api.permanent.uploadNews
		form = material   //material这里是数组
	}
	else {
		form.media = fs.createReadStream(material)  //meterial这里是路径
	}

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = uploadUrl + 'access_token=' + data.access_token

				if (!permanent) {
					url += '&type=' + type
				}
				else{
					form.access_token = data.access_token
				}

				var options = {
					method: 'POST',
					url: url,
					json: true
				}

				if (type === 'news') {
					options.body = form
				}
				else {
					options.formData = form //multipart/form-data
				}
				
				request(options).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Upload material fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.fetchMaterial = function(mediaId, type, permanent) {
	var that = this
	var fetchUrl = api.temporary.fetch

	if (permanent) {
		fetchUrl = api.permanent.fetch
	}	

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = fetchUrl + 'access_token=' + data.access_token
				var form = {}
				var options = {method: 'POST', url: url, json: true}


				if (permanent) {
					form.media_id = mediaId
					form.access_token = data.access_token
					options.body = form
				}
				else {
					if (type === 'video') {
						url = url.replace('https://', 'http://')
					}
					url += '&media_id=' + mediaId
				}

				if (type === 'news' || type === 'video') {
					request(options).then(function(response) {
						var _data = response.body

						if (_data) {
							resolve(_data)
						}
						else{
							throw new Error('fetch material fails')
						}
					})
					.catch(function(err) {
						reject(err)
					})					
				}
				else {
					resolve(url)
				}		
			})
	})
}



Wechat.prototype.deleteMaterial = function(mediaId) {
	var that = this
	var form = {
		media_id: mediaId
	}

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.permanent.del + 'access_token=' + data.access_token + '&media_id' + mediaId

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Delete material fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.updateMaterial = function(mediaId, news) {
	var that = this
	var form = {
		media_id: mediaId
	}


	_.extend(form, news)

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.permanent.update + 'access_token=' + data.access_token + '&media_id' + mediaId

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('update material fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.countMaterial = function() {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.permanent.count + 'access_token=' + data.access_token

				request({method: 'GET', url: url, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Count material fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.batchMaterial = function(options) {
	var that = this

	options.type = options.type || 'image'
	options.offset = options.offset || 0
	options.count = options.type || 1

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.permanent.batch + 'access_token=' + data.access_token

				request({method: 'POST', url: url, body:options, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Batch material fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.createTag = function(name) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.tag.create + 'access_token=' + data.access_token
				var form = {
					tag: {
						name: name
					}
				}

				request({method: 'POST', url: url, body:form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('create tag fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})	
			})
	})
}

Wechat.prototype.fetchTag = function(name) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.tag.fetch + 'access_token=' + data.access_token

				request({url: url, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('fetch tag fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})	
			})
	})
}

Wechat.prototype.checkTag = function(openId) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.tag.check + 'access_token=' + data.access_token
				var form = {
					openid: openId
				}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('check tag fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})	
			})
	})
}

Wechat.prototype.updateTag = function(id, name) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.tag.update + 'access_token=' + data.access_token
				var form = {
					tag: {
						id: id,
						name: name
					}
				}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('update tag fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})	
			})
	})
}

Wechat.prototype.deleteTag = function(id) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.tag.delete + 'access_token=' + data.access_token
				var form = {
					tag: {
						id: id,
					}
				}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('delete tag fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.taggetTag = function(tagid, next_openid) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.tag.tagget + 'access_token=' + data.access_token
				var form = {
					tagid: tagid,
					next_openid: next_openid
				}
				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('tagget fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.batchtagTag = function(openIds, tagid) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.tag.batchtag + 'access_token=' + data.access_token
				var form = {
					openid_list: openIds,
					tagid: tagid
				}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('batch tag fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.batchuntagTag = function(openIds, tagid) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.tag.batchuntag + 'access_token=' + data.access_token
				var form = {
					openid_list: openIds,
					tagid: tagid
					}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('batch tag fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.remarkUser = function(openid, remark) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.user.remark + 'access_token=' + data.access_token
				var form = {
					openid: openid,
					remark: remark
					}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('remark user fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.batchFetchUsers = function(openIds, lang) {
	var that = this

	lang = lang || 'zh_CN'

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var options = {
					json: true
				}

				if (_.isArray(openIds)) {
					options.url = api.user.batFetch + 'access_token=' + data.access_token
					options.body = {
						user_list: openIds
					}
					options.method = 'POST'
				}
				else {
					options.url = api.user.fetch + 'access_token=' + data.access_token + '&openid=' + openIds + '&lang=' + lang
				}

				request(options).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Fetch user fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.listUsers = function(openId) {   //获取用户列表
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.user.list + 'access_token=' + data.access_token

				if (openId) {
					url += '&next_openid=' + openId
				}

				request({url: url, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('list user fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.sendByTag = function(type, message, tagId) {
	var that = this
	var msg = {
		filter: {},
		msgtype: type
	}

	msg[type] = message

	if (!tagId) {
		msg.filter.is_to_all = true
	}
	else {
		msg.filter = {
			is_to_all: false,
			tag_id: tagId
		}
	}

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.mass.tag + 'access_token=' + data.access_token

				request({method: 'POST', url: url, body: msg, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Send to tag fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.sendByOpenId = function(type, message, openIds) {
	var that = this
	var msg = {
		msgtype: type,
		touser: openIds
	}

	msg[type] = message

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.mass.openId + 'access_token=' + data.access_token

				request({method: 'POST', url: url, body: msg, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Send By Openid fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.deleteMass = function(msgId) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.mass.del + 'access_token=' + data.access_token
				var form = {
					msg_id: msgId
				}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Delete mass fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.previewMass = function(type, message, openId) {
	var that = this
	var msg = {
		msgtype: type,
		touser: openId
	}

	msg[type] = message

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.mass.preview + 'access_token=' + data.access_token

				request({method: 'POST', url: url, body: msg, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Preview mass fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.checkMass = function(msgId) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.mass.check + 'access_token=' + data.access_token
				var form = {
					msg_id: msgId
				}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('check mass fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.createMenu = function(menu) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.menu.create + 'access_token=' + data.access_token

				request({method: 'POST', url: url, body: menu, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Create menu fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.getMenu = function() {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.menu.get + 'access_token=' + data.access_token

				request({url: url, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Get menu fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.deleteMenu = function() {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.menu.del + 'access_token=' + data.access_token

				request({url: url, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Delete menu fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.getCurrentMenu = function() {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.menu.current + 'access_token=' + data.access_token

				request({url: url, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Get current menu fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.createQrcode = function(qr) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.qrcode.create + 'access_token=' + data.access_token

				request({method: 'POST', url: url, body: qr, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Create qrcode fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.showQrcode = function(ticket) {
	return api.qrcode.show + 'ticket=' + encodeURI(ticket)
}

Wechat.prototype.createShorturl = function(action, url) {
	action = action || 'long2short'

	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.shortUrl.create + 'access_token=' + data.access_token
				var form = {
					action: action,
					long_url: url
				}

				request({method: 'POST', url: url, body: form, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('Create shorturl fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.semantic = function(semanticData) {
	var that = this

	return new Promise(function(resolve, reject) {
		that
			.fetchAccessToken()
			.then(function(data) {
				var url = api.semanticUrl + 'access_token=' + data.access_token
				semanticData.appid = data.appID

				request({method: 'POST', url: url, body: semanticData, json: true}).then(function(response) {
					var _data = response.body

					if (_data) {
						resolve(_data)
					}
					else{
						throw new Error('semantic fails')
					}
				})
				.catch(function(err) {
					reject(err)
				})
			})
	})
}

Wechat.prototype.reply = function() {
	var content = this.body   //外层业务的回复
	var message = this.weixin
	var xml = util.tpl(content, message)

	this.status = 200
	this.type = 'application/xml'
	this.body = xml
}

module.exports = Wechat