var mongoose = require('mongoose')
var CommentSchema = require('../schemas/comment')
var Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment