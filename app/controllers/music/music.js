'use strict';

var mongoose = require('mongoose'),
    Music = mongoose.model('Music'),              // 音乐数据模型
    MusicCategory = mongoose.model('MusicCategory');
var path = require('path');

/* 后台录入路由 */
exports.new = function *(next) {
  var musicCategories = yield MusicCategory
      .find({})
      .populate({
        path: 'musics',
        select: 'title'
      })
      .exec();
  yield this.render('pages/music/music_admin', {
    title:'豆瓣音乐后台录入页',
    logo:'music',
    music:{},
    musicCategories: musicCategories
  })
};

var util = require('../../../libs/util');

// admin poster
exports.savePoster = function *(next) {     //文件上传
  // 如果有文件上传通过koa-body中间件生成临时文件并通过this.request.body.files进行访问
  // 当提交表单中有文件上传请求时表单要使用enctype="multipart/form-data"编码格式
  var posterData = this.request.body.files.uploadMusicImage;   // 上传文件
  var filePath = posterData.path;                              // 文件路径
  var name = posterData.name;                                  // 原始名字

  if (name) {  //本地上传的
    var data = yield util.readFileAsync(filePath);
    var timestamp = Date.now();                                // 时间戳
    var type = posterData.type.split('/')[1];                  // 图片的种类
    var poster = timestamp + '.' + type;
    var newPath = path.join(__dirname, '../../../', '/public/upload/music/' + poster);

    yield util.writeFileAsync(newPath, data);

    this.poster = poster;
  }
  yield next;
};

//后台录入控制器
exports.save = function *(next) {
  var musicObj = this.request.body.fields;
  var newMusic = new Music(musicObj);
  var _newMusic = yield newMusic.save();
  console.log('保存完成');
  this.redirect('/admin/music/list');
};

// 电影列表页控制器
exports.list = function *(next) {
  var musics = yield Music.find({})
      .populate('category', 'name')
      .exec();

  yield this.render('pages/music/music_list', {
    title: '豆瓣音乐列表页',
    musics: musics,
    logo: 'music'
  });
};

//list delete music
exports.del = function *(next) {
  var id = this.query.id;
  // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
  if(id) {
    var music = yield Music.findOne({_id: id}).exec();
    for(var i=0; i < music.musicCategory.length; i++) {
      var musicCategory = yield MusicCategory.findOne({_id: music.musicCategory[i]});
      if (musicCategory) {
        var index = musicCategory.musics.indexOf(id);  // 在音乐分类movies数组中查找该值所在位置
        musicCategory.musics.splice(index, 1);         // 从分类中删除该数据
        yield musicCategory.save();                    // 对变化的音乐分类数据进行保存
      }
    }
    yield Music.remove({_id: id});                // 音乐模型中删除该电影数据
    this.body = {success: 1};                     // 返回删除成功的json数据给游览器
  }
};