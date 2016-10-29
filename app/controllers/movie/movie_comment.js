'use strict';
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

// 电影评论后台录入控制器
exports.save = function *(next) {
	var _comment = this.request.body.comment;         // 获取post发送的数据
	var movieId = _comment.movie;
	// 如果存在cid说明是对评论人进行回复
	if (_comment.cid) {      //回复评论
		let comment = yield Comment.findOne({_id: _comment.cid}).exec();
			
		var reply = {
			from: _comment.from,                    // 二级回复中谁回复谁的前面那个谁
			to: _comment.tid,                       // 后面那个谁
			content: _comment.content,              // 回复内容
			meta: {
				createAt: Date.now()
			}
		};

		comment.reply.push(reply);
		yield comment.save();

		this.body = {success: 1};
	}
	else {
		let comment = new Comment({
			movie: _comment.movie,
			from: _comment.from,
			content: _comment.content
		});

		yield comment.save();
		this.body = {success: 1};
	}
};

// 删除电影评论控制器
exports.del = function *(next) {
	// 获取客户端Ajax发送的URL值中的id值
	var cid = this.request.query.cid;          // 获取该评论的id值
	var did = this.request.query.did;					 // 获取二级回复评论的id值
	// 如果点击的是叠楼中的回复评论的删除按钮
	if(did !== 'undefined') {
		// 先查找到该叠楼评论
		var comment = yield Comment.findOne({_id: cid}).exec();
		var len = comment.reply.length;      // 获取该叠楼评论中回复评论的条数
		for(var i = 0; i < len; i++){
			if(comment.reply[i] && comment.reply[i]._id.toString() === did) {
				comment.reply.splice(i, 1);
			}
		}
		// 保存评论
		yield comment.save();
		this.body = {success: 1};
	}else {   // 若是点击第一级评论中的删除
		yield Comment.remove({_id: cid});
		this.body = {success:1};
	}
};
