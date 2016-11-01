'use strict';

var mongoose = require('mongoose'),
    Music = mongoose.model('Music'),              // 音乐数据模型
    MusicCategory = mongoose.model('MusicCategory');
var path = require('path');    // 路径模块
var _ = require('lodash');     // 该模块用来对变化字段进行更新

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
  var musicObj = this.request.body.fields || {};
  var _music;
  var _musicCategoryName;
  var musicCategoryId = musicObj.musicCategory;         // 获取音乐分类ID
  var musicCategoryName = musicObj.musicCategoryName;   // 获取音乐所属分类名称
  var id = musicObj._id;                                // 获取音乐所属分类ID值
  if (this.poster) {          // 如果有自定义上传海报  将movieObj中的海报地址改成自定义上传海报的地址
    musicObj.poster = this.poster;
  }
  if(id){       // 如果id值存在，则说明是对已存在的数据进行更新

    var music = yield Music.findOne({_id: id}).exec();
    if (music.musicCategory) {       //如果刚开始类型有被选择的话
      if (musicCategoryId.toString() !== music.musicCategory.toString()) {  // 如果修改音乐分类
        if(musicCategoryId.length === 24){   //分类选择改为只选择一个
          if (music.musicCategory.length === 24){  //分类选择初始为一个
            _oldCat = yield MusicCategory.findOne({_id: music.musicCategory}).exec();   // 在原音乐分类的属性中找到该音乐的id值并将其删除
            index = _oldCat.musics.indexOf(id);
            _oldCat.musics.splice(index, 1);
            yield _oldCat.save();
            _newCat = yield MusicCategory.findOne({_id: musicCategoryId}).exec(); // 找到音乐对应的新电影分类
            _newCat.musics.push(id);    // 将其id值添加到音乐分类的musics属性中并保存
            yield _newCat.save();
          }else{    //分类选择初始为多个
            for(var i = 0; i < music.musicCategory.length; i++){   //遍历该音乐的所有所属分类
              _oldCat = yield MusicCategory.findOne({_id: music.musicCategory[i]}).exec();   // 在原音乐分类的属性中找到该音乐的id值并将其删除
              index = _oldCat.musics.indexOf(id);
              _oldCat.musics.splice(index, 1);
              yield _oldCat.save();
            }
            _newCat = yield MusicCategory.findOne({_id: musicCategoryId}).exec(); // 找到音乐对应的新电影分类
            _newCat.musics.push(id);    // 将其id值添加到音乐分类的musics属性中并保存
            yield _newCat.save();
          }
        }else{   //分类选择为多个
          for(var i = 0; i < music.musicCategory.length; i++){   //遍历该音乐的所有所属分类
            var _oldCat = yield MusicCategory.findOne({_id: music.musicCategory[i]}).exec();   // 在原音乐分类的属性中找到该音乐的id值并将其删除
            var index = _oldCat.musics.indexOf(id);
            _oldCat.musics.splice(index, 1);
            yield _oldCat.save();
          }
          for(i=0; i< musicCategoryId.length; i++){     //遍历该音乐新选择的所有分类
            var _newCat = yield MusicCategory.findOne({_id: musicCategoryId[i]}).exec(); // 找到音乐对应的新电影分类
            _newCat.musics.push(id);    // 将其id值添加到音乐分类的musics属性中并保存
            yield _newCat.save();
          }
        }
      }
    }else{       //如果刚开始类型一个也没有被选择的话
      if(musicCategoryId.length > 0) {    //如果选择了分类
        for(i=0; i< musicCategoryId.length; i++){     //遍历该音乐新选择的所有分类
          _newCat = yield MusicCategory.findOne({_id: musicCategoryId[i]}).exec(); // 找到音乐对应的新电影分类
          _newCat.musics.push(id);    // 将其id值添加到音乐分类的musics属性中并保存
          yield _newCat.save();
        }
      }else {
        this.redirect('/admin/music/list');
      }
    }

    _music = _.extend(music, musicObj);   //underscore换成lodash了
    yield _music.save();

    this.redirect('/admin/music/list');
    //this.redirect('/music/' + _music._id); //重定向



  }else if(musicObj.title) {   // 如果表单中填写了音乐名称 则查找该音乐名称是否已存在
    // 查找该音乐名称是否已存在
    _music = yield Music.findOne({title: musicObj.title}).exec();
    if (_music && musicObj.singer && musicObj.singer === _music.singer) {
      console.log('音乐已存在');
      this.redirect('/admin/music/list');
    }else {      // 创建一个新音乐数据
      _music = new Music(musicObj);
      if (musicCategoryId) {      // 如果选择了音乐所属的音乐分类
        if(musicCategoryId.length === 24){  //只选一个类别的时候,长度是24(ObjectId的长度)
          var musicCategory = yield MusicCategory.findOne({_id: musicCategoryId}).exec();
          musicCategory.musics.push(_music._id);
          yield musicCategory.save();
        }else{           // 多选类别
          for (var y=0; y<musicCategoryId.length; y++) {
            musicCategory = yield MusicCategory.findOne({_id: musicCategoryId[y]}).exec();
            musicCategory.musics.push(_music._id);
            yield musicCategory.save();
          }
        }
        yield _music.save();
        this.redirect('/admin/music/category/list');
      }
      else if (musicCategoryName) {       // 输入新的音乐分类
        _musicCategoryName = yield MusicCategory.findOne({name: musicCategoryName}).exec();
        if (_musicCategoryName) {
          console.log('音乐分类已存在');
          this.redirect('/admin/music/category/list');
        }else {   //创建新的音乐分类
          musicCategory = new MusicCategory({
            name: musicCategoryName,
            musics: [_music._id]
          });
          yield musicCategory.save();   // 保存新创建的音乐分类
          _music.musicCategory = musicCategory._id;  // 将新创建的音乐保存，musicCategory的ID值为对应的分类ID值
          yield _music.save();
          //this.redirect('/music/' + _movie._id);
        }
      }else{
        console.log('录制音乐不成功,请选择或输入音乐分类');
        this.redirect('/admin/music/new');
      }
    }
  }else if(musicCategoryName) {     // 没有输入音乐名称 而只输入了音乐分类名称
    // 查找音乐分类是否已存在
    _musicCategoryName = yield MusicCategory.findOne({name: musicCategoryName}).exec();
    if(_musicCategoryName) {
      console.log('音乐分类已存在');
      this.redirect('/admin/music/category/list');
    }else{
      // 创建新的音乐分类
      var newCategory = new MusicCategory({
        name: musicCategoryName
      });
      // 保存新创建的音乐分类
      yield newCategory.save();
      this.redirect('/admin/music/category/list');
    }
  }
};

// admin update music
exports.update = function *(next) {
  var id = this.params.id;

  if (id) {
    var music = yield Music
        .findOne({_id: id})
        .populate('musicCategory', 'name')
        .exec();
    var musicCategories = yield MusicCategory.find({}).exec();

    yield this.render('pages/music/music_admin', {
      title: 'music 后台更新页',
      music: music,
      logo: 'music',
      musicCategories: musicCategories
    });
  }
};

// 音乐列表页控制器
exports.list = function *(next) {
  var musics = yield Music.find({})
      .populate('musicCategory', 'name')
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
    yield Music.remove({_id: id});                // 音乐模型中删除该音乐数据
    this.body = {success: 1};                     // 返回删除成功的json数据给游览器
  }
};