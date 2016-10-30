var mongoose = require('mongoose');
var MusicProgrammeSchema = require('../../schemas/music/music_programme');
var MusicProgramme = mongoose.model('MusicProgramme', MusicProgrammeSchema);

module.exports = MusicProgramme;