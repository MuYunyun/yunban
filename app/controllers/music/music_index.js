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
  var albumName = this.request.query.albumName;    // 获取新碟榜区分类请求名称
  var hotProName = this.request.query.hotProName;  // 获取近期热门歌单分类请求名称
  var hotSongs = this.request.query.hotSongs;      // 获取本周单曲榜区分类请求名称

  if(albumName){   //如果是新碟部分发送Ajax请求
    var musicCategory = yield MusicCategory
        .findOne({name: albumName})
        .populate({
          path: 'musics',
          select: 'title poster singer',
          options: {limit: 8}                  // 限制最多8条数据
        })
        .exec();
    this.body = ({data: musicCategory});
  }else if(hotProName){   // 如果是热门歌单部分发送Ajax请求
    var programme = yield Programme
        .findOne({name: hotProName})
        .populate({
          path: 'musicCategories',
          select: 'name musics',
          options: {limit:6}                   // 限制最多6条数据
        })
        .exec();
    // 获取近期热门歌单最热,流行,摇滚等歌曲分类
    if(programme) {
      var musicCategories = programme.musicCategories,
          len = musicCategories.length,
          count = 0,
          dataMusics = [];
      for(var i = 0; i < len; i++) {
        var musics = yield MusicCategory
            .findOne({_id: musicCategories[i]._id})
            .populate({
              path: 'musics',
              select: 'title poster',
              options: {limit: 3}                  // 限制最多3条数据
            })
            .exec();
        count++;
        dataMusics.push(musics);
        if(count === len){
          this.body = {dataPro:programme,data:dataMusics}
        }
      }
    }else {
      this.body = {data:programme};
    }
  }else if(hotSongs){ // 如果是本周单曲榜部分发送Ajax请求
    var musicCategory = yield MusicCategory
        .findOne({name: hotSongs})
        .populate({
          path: 'musics',
          select: 'title poster singer pv',
          options: {limit: 10,sort:{pv: -1}}
        })
        .exec();
    this.body = {data:musicCategory};
  }else{        // 没有Ajax请求,则是渲染整个音乐首页
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
  }
};

//电影广告链接页面
exports.gallery = function *(next) {
  yield this.render('pages/music/music_gallery', {
    title: '豆瓣音乐广告页面'
  });
};