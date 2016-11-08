'use strict';
var Music = require('../../api/music');

/* 音乐首页交互 */
var mongoose = require('mongoose'),
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
    // 获取云瓣音乐顶部轮播图文件夹中图片数量
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
      title: '云瓣音乐首页',
      logo: 'music',                       // 显示音乐logo
      musicCategories: musicCategories,    // 返回查询到的全部歌曲分类
      programmes: programmes,              // 返回查询到的近期热门歌单数量
      fileList: fileList                   // 首页轮播图图片数量
    })
  }
};

/* 首页热门音乐分类及音乐搜索&&更多类目 */
exports.search = function *(next) {
  var q = this.query.q;                             // 获取搜索框提交内容
  var page = parseInt(this.query.p, 10) || 0;       // 获取页面
  var count = 6;             //每页展示的数据
  var index = page * count;  //索引的开始位置
  var proId = this.query.pro;    //近期热门歌单以及热门音乐更多查询ID
  var categories = yield Music.searchByCategory(q);
  var category = categories[0] || {};                    // 查询到的音乐分类

  if(proId) {     // 近期热门歌单区歌单分类 && 热门音乐分类(这部分不做分页处理)
    var musicCategories = yield Programme
        .find({_id: proId})
        .populate({path: 'musicCategories',
                   select:'name musics'
        })
        .exec();
    if(musicCategories) {  // 查询近期热门歌单或热门音乐中的分类
      var musicCats = musicCategories[0].musicCategories || {}, //这里要用[0]是因为musicCategories是一个含一个对象的数组
          dataMusics = [],
          count = 0,
          len = musicCats.length;
      for(var i = 0; i < len; i++){
        var musics = yield MusicCategory
            .findOne({_id:musicCats[i]._id})
            .populate({
              path:'musics',
              select: 'title poster',
              options: {limit: 6}   //限制更多里每个类别展现6张
            })
            .exec();
        count ++;
        dataMusics.push(musics);

        if (count === len){
          yield this.render('pages/music/music_results', {
            title:'云瓣音乐',
            logo: 'music',
            keyword: musicCategories[0].name,                    // results界面上的名称
            musicCats: dataMusics                                      // 查询到音乐分类下所含的音乐
          })
        }
      }
    }
  }else if (category.name) {
    var musics = category.musics || [];                    // 分类中包含的音乐
    var results = musics.slice(index, index + count);      // 分类页面每页显示的音乐数量

    yield this.render('pages/music/music_results', {
      title: '云瓣音乐结果列表页面',
      logo:'music',                                        //显示音乐logo
      keyword: category.name,                              // 分类名称
      currentPage: (page + 1),                             // 当前页
      query: 'q=' + q,                                     // 分类名称
      totalPage: Math.ceil(musics.length / count),         // 总页数，需向上取整
      musics: results                                      // 查询到音乐分类下所含的音乐
    });
  }else {                                       //对单独音乐进行搜索
    musics = yield Music.searchByName(q);
    var num = musics.length || 0;
    results = musics.slice(index, index + count);

    yield this.render('pages/music/music_results', {
      title: '云瓣音乐搜索结果列表页面',
      logo:'music',
      keyword: '共找到'+ num +'条与"' + q + '"相关的音乐',
      currentPage: (page + 1),
      query: 'q=' + q,
      totalPage: Math.ceil(musics.length / count),
      musics: results
    });
  }
};

//音乐广告链接页面
exports.gallery = function *(next) {
  yield this.render('pages/music/music_gallery', {
    title: '云瓣音乐广告页面'
  });
};

//播放全部音乐
exports.musicPlay = function *(next) {
  var media = path.join(__dirname, '../../../public/media');
  var names = fs.readdirSync(media);
  yield this.render('pages/music/music_play', {
    title: '云瓣音乐',
    musics: names
  });
};