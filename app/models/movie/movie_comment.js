var mongoose = require('mongoose');
var CommentSchema = require('../../schemas/movie/movie_comment');
var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;