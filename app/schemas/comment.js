var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
	movie: {type: ObjectId, ref: 'Movie'}, //当前要评论的电影,ref指向数据库的模型
	from: {type: ObjectId, ref: 'User'}, //评论来自谁
	reply: [{
		from: {type: ObjectId, ref: 'User'},
		to: {type: ObjectId, ref: 'User'}, //评论给谁
		content: String
	}],
	content: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

CommentSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}

	next()
})

CommentSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb) 
	}
}

module.exports = CommentSchema












