'use strict';

$.support.cors = true;                // 解决IE8/9 Ajax跨域请求问题

$(function() {
  $('.musicDel').click(function(e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);
    $.ajax({
      type: 'DELETE',
      url: '/admin/music/list?id=' + id
    })
        .done(function(results){
          // 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
          if (results.success === 1) {
            if (tr.length > 0) {
              tr.remove();
            }
          }
        })
  });

  // 获取音乐分类列表删除按钮类名，当点击删除按钮触发删除事件
  $('.musicCtyDel').click(function(e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);

    $.ajax({
      type: 'DELETE',
      url: '/admin/music/category/list?id=' + id
    })
        .done(function(results){
          // 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
          if (results.success === 1) {
            if (tr.length > 0) {
              tr.remove();
            }
          }
        })
  });

  $('#doubanMusic').blur(function() {
    var id = $(this).val();
    if(id) {
      $.ajax({
        url: 'https://api.douban.com/v2/music/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback'
      })
          .done(function(data) {
            $('#inputMusicTitle').val(data.title);                 // 标题
            $('#inputMusicAltTitle').val(data.alt_title);          // 别名
            $('#inputMusicImage').val(data.image);                 // 海报
            $('#inputMusicSummary').val(data.summary);             // 歌曲简介
            if(data.rating) {
              $('#inputMusicRating').val(data.rating.average);     // 豆瓣评分
            }
            if(data.attrs) {
              $('#inputMusicMedia').val(data.attrs.media);         // 介质
              $('#inputMusicPubdate').val(data.attrs.pubdate);     // 发行时间
              $('#inputMusicVersion').val(data.attrs.version);     // 专辑类型
              $('#inputMusicSinger').val(data.attrs.singer);       // 歌手
              $('#inputMusicPublisher').val(data.attrs.publisher); // 出版者
            }
          })
    }
  })
});