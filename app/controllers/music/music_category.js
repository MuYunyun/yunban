'use strict';

var mongoose = require('mongoose');
var MusicCategory = mongoose.model('MusicCategory');

// music_category_admin new page
exports.new = function *(next) {
  yield this.render('pages/music/music_category_admin', {
    title: '豆瓣后台音乐分类录入页',
    logo: 'movie',
    category: {}
  });
};

// 音乐分类存储控制器
exports.save = function *(next) {
  var musicCategory = this.request.body.musicCategory;
  // 判断新创建的电影分类是否已存在，避免重复输入
  var _musicCategory =  yield MusicCategory.findOne({name:musicCategory.name}).exec();
  if(_musicCategory) {
    console.log('电影分类已存在');
  }else {
    musicCategory = new MusicCategory(musicCategory);
    yield musicCategory.save();
    console.log('保存成功');
  }
};

// 音乐分类列表页控制器
exports.list = function *(next) {
  var musicCategories = yield MusicCategory
      .find({})
      .populate({
        path: 'musics',
        select: 'title'
      })
      .exec();
  yield this.render('pages/music/music_category_list', {
    title: '豆瓣音乐分类列表页',
    logo: 'music',
    musicCategories: musicCategories
  })
};

// 电影分类列表删除控制器
exports.del = function *(next) {
  var id = this.request.query.id;
  if(id) {
    var musicCategory = yield MusicCategory.findOne({_id: id}).exec();
    for (var i=0; i < musicCategory.musics.length; i++){
      var music = yield Music.findOne({_id: musicCategory.musics[i]}).exec();
      if (music) {
        var index = music.category.indexOf(id);         // 在音乐分类category数组中查找该值所在位置
        music.category.splice(index, 1);                // 从分类中删除该数据
        yield music.save();                             // 对变化的音乐分类数据进行保存
      }
    }
    yield musicCategory.remove({_id: id});              // 音乐分类模型中删除该分类数据
    this.body = {success:1};                            // 返回删除成功的json数据给游览器
  }
};



