'use strict';

/* 音乐首页交互 */
var mongoose = require('mongoose'),
    Music = mongoose.model('Music'),         //音乐数据模型
    musicCategory = mongoose.model('MusicCategory');   //音乐类别数据模型


/* 音乐首页 */
exports.index = function *(next){
  yield this.render('pages/music/music_index', {
    title: '豆瓣音乐首页',
    logo: 'music'               // 显示音乐logo
  })
};