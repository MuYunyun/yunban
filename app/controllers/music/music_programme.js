'use strict';

/* 音乐首页交互 */
var mongoose = require('mongoose'),
    Programme = mongoose.model('MusicProgramme'),            // 引入近期热门歌单区域模型
    musicCategory = mongoose.model('MusicCategory');


/* 音乐首页 */
exports.list = function *(next){
  var programmes = yield Programme
      .find({})
      .populate({
        path: 'musicCategories',
        select: 'name',
      })
      .exec();
  yield this.render('pages/music/music_programme_list', {
    title: '云瓣音乐热门歌单列表页',
    logo: 'music',               // 显示音乐logo
    programmes: programmes
  })
};

// 云瓣音乐热门歌单列表页删除相应榜单名处理函数
exports.del = function *(next) {
  var id = this.request.query.id;
  if(id) {
    // 删除musicCategory里的categoryId
    var programme = yield Programme.findOne({_id: id}).exec();
    for (var i=0; i < programme.musicCategories.length; i++){
      var category = yield musicCategory.findOne({_id: programme.musicCategories[i]}).exec();

      if (category) {
        var index = category.programme.indexOf(id);         // 在音乐分类category数组中查找该值所在位置
        category.programme.splice(index, 1);                // 从分类中删除该数据
        yield category.save();                             // 对变化的音乐分类数据进行保存
      }
    }
    yield Programme.remove({_id: id});              // 音乐榜单模型中删除该分类数据
    this.body = {success:1};                            // 返回删除成功的json数据给游览器
  }
};