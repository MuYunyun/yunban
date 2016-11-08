'use strict';

$.support.cors = true;             // 解决IE8/9 Ajax跨域请求问题

$(function() {
  // 获取电影列表删除按钮类名，当点击删除按钮触发删除事件
  $('.movieDel').click(function(e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);

    $.ajax({
      type: 'DELETE',
      url: '/admin/movie/list?id=' + id
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
  // 获取电影分类列表删除按钮类名，当点击删除按钮触发删除事件
  $('.ctyDel').click(function(e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);

    $.ajax({
      type: 'DELETE',
      url: '/admin/movie/category/list?id=' + id
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
  // 获取影院列表删除按钮类名，当点击删除按钮触发删除事件
  $('.cityDel').click(function(e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);

    $.ajax({
      type: 'DELETE',
      url: '/admin/city/list?id=' + id
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




  // 电影分类同步云瓣api数据鼠标离开事件
  $('#doubanMovie').blur(function() {
    var douban = $(this);
    var id = douban.val();

    if (id) {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function(data) {
          $('#inputTitle').val(data.title);                         // 标题
          $('#inputAka').val(data.aka[0]);                          // 又名
          $('#inputDirector').val(data.directors[0].name);          // 导演
          $('#inputPoster').val(data.images.large);                 // 电影海报
          $('#inputYear').val(data.year);                           // 上映时间
          $('#inputSummary').val(data.summary);                     // 简介
          $('#inputRating').val(data.rating.average);               // 云瓣评分
          if(data.countries) {
            var countries = '';
            data.countries.forEach(function(item, index) {
              countries += item;
              if(index < data.countries.length - 1){  // 最后一个国家不添加'/'
                countries += '/';
              }
            });
            $('#inputCountry').val(countries);                         // 国家
          }
          if(data.casts) {
            var castNames = '';
            data.casts.forEach(function(item, index) {
             castNames += item.name;
              if(index < data.casts.length - 1){  // 最后一个主演不添加'/'
                castNames += '/';
              }
            });
            $('#inputCasts').val(castNames);                         // 主演
          }
          if(data.genres) {
            var genreName = '';
            data.genres.forEach(function(item, index) {
              genreName += item;
              if(index < data.genres.length - 1){
                genreName += '/';
              }
            });
            $('#inputGenres').val(genreName);                       // 类型
          }
        }
      })
    }
  })
});