var mongoose = require('mongoose');
var MusicCommentSchema = require('../../schemas/music/music_comment');
var MusicComment = mongoose.model('MusicComment', MusicCommentSchema);

module.exports = MusicComment;