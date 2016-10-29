'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
	director: String,          //导演
	title: String,             //标题
	doubanId: String,          //豆瓣ID
	country: String,           //国家/地区
	summary: String,           //简介
	flash: String,             //片源地址
	poster: String,            //电影海报
	genres: String,            //类型
	year: Number,              //上映年份
	aka: String,               //又名
	casts: String,             //主演
	rating: String,            //豆瓣评分
	pv: {                      //访问量
		type: Number,
		default: 0
	},
	category: [{                //电影分类
		type: ObjectId,
		ref: 'Category'
	}],
	meta: {
		createAt: {              //创建时间
			type: Date,
			default: Date.now()
		},
		updateAt: {              //更新时间
			type: Date,
			default: Date.now()
		}
	}
});

MovieSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}

	next();
});

MovieSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb);
	}
};

module.exports = MovieSchema;












