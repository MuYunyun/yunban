'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MusicProgrammeSchema = new Schema({
  name: String,
  musicCategories: [{type: ObjectId, ref: 'MusicCategory'}],
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

MusicProgrammeSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else{
    this.meta.updateAt = Date.now();
  }

  next();
});

MusicProgrammeSchema.statics = {
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

module.exports = MusicProgrammeSchema;