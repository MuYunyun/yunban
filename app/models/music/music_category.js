var mongoose = require('mongoose');
var MusicCategorySchema = require('../../schemas/music/music_category');
var MusicCategory = mongoose.model('MusicCategory', MusicCategorySchema);

module.exports = MusicCategory;