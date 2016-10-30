'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//音乐分类数据类型
var MusicCategorySchema = new Schema({
  name: String,
  musics: [{type: ObjectId, ref: 'Music'}],
  programme: [{type: ObjectId, ref: 'Programme'}],
  meta: {
    createAt: {              //创建时间
      type: Date,
      default: Date.now()
    },
    updateAt: {              //更新时间
      type: Date,
      default: Date.now()
    }
  }
});

MusicCategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else{
    this.meta.updateAt = Date.now();
  }

  next();
});

MusicCategorySchema.statics = {
  fetch: function(cb) {
    return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb);
  },
  findById: function(id, cb) {
    return this
        .findOne({_id: id})
        .exec(cb);
  }
};

module.exports = MusicCategorySchema;