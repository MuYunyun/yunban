'use strict';

var mongoose = require('mongoose');
var MusicCategory = mongoose.model('MusicCategory');        // 引入音乐分类模型
var Music = mongoose.model('Music');                        // 音乐模型
var MusicProgramme = mongoose.model('MusicProgramme');      // 引入近期热门歌单区域模型

// music_category_admin new page
exports.new = function *(next) {
  var musicProgramme = yield MusicProgramme.find({});
  yield this.render('pages/music/music_category_admin', {
    title: '云瓣后台音乐分类录入页',
    logo: 'music',
    musicProgrammes:musicProgramme,
    musicCategory: {}
  });
};

// 音乐分类存储控制器
exports.save = function *(next) {
  var musicCategory = this.request.body.musicCategory;           // 获取当前填写的音乐分类
  var musicProgramme = musicCategory.programmeName;              // 获取榜单分类名
  var musicCatName = musicCategory.name;                         // 获取输入的音乐分类名
  var programmeId = musicCategory.musicProgramme;                // 获取填写的音乐榜单分类ID
  var programmeName = musicCategory.programmeName;               // 获取表单分类名
  if (musicCatName){        //输入音乐分类
    //判断新创建的音乐分类是否已存在，避免重复输入
    var _musicCategory = yield MusicCategory.findOne({name:musicCatName}).exec();
    if(_musicCategory) {
      console.log('音乐分类已存在');
      this.redirect('/admin/music/category/new');
    }else {          // 创建一个新音乐分类数据
      musicCategory = new MusicCategory({name:musicCatName});
      var _newMusicCategory = yield musicCategory.save();
      if (programmeId) {      // 如果选择了热门榜单分类
        if(programmeId.length === 24){  //只选一个类别的时候,长度是24(ObjectId的长度)
          musicProgramme = yield MusicProgramme.findOne({_id: programmeId}).exec();
          musicProgramme.musicCategories.push(_newMusicCategory._id);
          yield musicProgramme.save();
          _newMusicCategory.programme.push(programmeId);
        }else{           // 多选类别
          for (var y=0; y<programmeId.length; y++) {
            musicProgramme = yield MusicProgramme.findOne({_id: programmeId[y]}).exec();
            musicProgramme.musicCategories.push(_newMusicCategory._id);
            yield musicProgramme.save();
            _newMusicCategory.programme.push(programmeId[y]);
          }
        }
        yield _newMusicCategory.save();
      }else if(programmeName) {               //输入榜单分类
        _programme = yield MusicProgramme.findOne({name:programmeName}).exec();
        if(_programme){
          console.log('音乐榜单分类已存在');
          this.redirect('/admin/music/programme/list');
        }else{
          var newProgramme = new MusicProgramme({
            name:programmeName,
            musicCategories:_newMusicCategory._id
          });
          // 保存新创建的音乐榜单分类
          var _newProgramme = yield newProgramme.save();
          _newMusicCategory.programme.push(_newProgramme._id);
          yield _newMusicCategory.save();
          this.redirect('/admin/music/programme/list');
        }
      }
      this.redirect('/admin/music/category/list');      //输入音乐分类的时候跳转
    }
  }else if (musicProgramme) {            // 如果只输入了榜单名称
    // 查找输入的榜单名称是否已经存在
    var _programme = yield MusicProgramme.findOne({name:musicProgramme});
    if(_programme) {
      console.log('音乐榜单分类已存在');
      this.redirect('/admin/music/programme/list');
    }else{
      musicProgramme = new MusicProgramme({
        name: musicProgramme
      });
      yield musicProgramme.save();
      this.redirect('/admin/music/programme/list');
    }
  }
};

// 音乐分类列表页控制器
exports.list = function *(next) {
  var musicCategories = yield MusicCategory
      .find({})
      .populate('musics', 'title')
      .exec();
  yield this.render('pages/music/music_category_list', {
    title: '云瓣音乐分类列表页',
    logo: 'music',
    musicCategories: musicCategories
  })
};

// 音乐分类列表删除控制器
exports.del = function *(next) {
  var id = this.request.query.id;
  if(id) {
    // 删除music里的categoryId
    var musicCategory = yield MusicCategory.findOne({_id: id}).exec();
    for (var i=0; i < musicCategory.musics.length; i++){
      var music = yield Music.findOne({_id: musicCategory.musics[i]}).exec();
      if (music) {
        var index = music.musicCategory.indexOf(id);         // 在音乐分类category数组中查找该值所在位置
        music.musicCategory.splice(index, 1);                // 从分类中删除该数据
        yield music.save();                             // 对变化的音乐分类数据进行保存
      }
    }
    //删除programme里的categoryId
    for (var y=0; i < musicCategory.programme.length; i++){
      var programme = yield MusicProgramme.findOne({_id: musicCategory.programme[i]}).exec();
      if (programme) {
        index = programme.musicCategories.indexOf(id);     // 在榜单分类categories数组中查找该值所在位置
        programme.musicCategories.splice(index, 1);        // 从分类中删除该数据
        yield programme.save();                            // 对变化的音乐分类数据进行保存
      }
    }
    yield musicCategory.remove({_id: id});              // 音乐分类模型中删除该分类数据
    this.body = {success:1};                            // 返回删除成功的json数据给游览器
  }
};



