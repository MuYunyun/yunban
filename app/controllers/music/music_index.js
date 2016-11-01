'use strict';

/* 音乐首页交互 */
var mongoose = require('mongoose'),
    Music = mongoose.model('Music'),         //音乐数据模型
    MusicCategory = mongoose.model('MusicCategory'),   //音乐类别数据模型
    Programme = mongoose.model('MusicProgramme'),   // 引人近期热门歌单区域模型
    path = require('path'),                  // 路径模块
    fs = require('fs');                      // 路径模块

/* 音乐首页 */
exports.index = function *(next){
  // 获取豆瓣音乐顶部轮播图文件夹中图片数量
  var newPath = path.join(__dirname,'../../../public/libs/images/music/gallery'),
      dirList = fs.readdirSync(newPath),
      fileList = [],
      reg = /^(.+)\.(jpg|bmp|gif|png)$/i;       // 通过正则匹配图片

  dirList.forEach(function(item) {
    if(reg.test(item)){
      fileList.push(item);
    }
  });

  var musicCategories = yield MusicCategory
      .find({})
      .populate('musics')
      .exec();
  // 歌单区域歌曲分类查找
  var programmes = yield Programme
      .find({})
      .populate({
        path: 'musicCategories',
        select: 'name musics'
      })
      .exec();
  yield this.render('pages/music/music_index', {
    title: '豆瓣音乐首页',
    logo: 'music',                       // 显示音乐logo
    musicCategories: musicCategories,    // 返回查询到的全部歌曲分类
    programmes: programmes,              // 返回查询到的近期热门歌单数量
    fileList: fileList                   // 首页轮播图图片数量
  })
};