'use strict';

$.support.cors = true;                 // 解决IE8/9 Ajax跨域请求问题

// 评论区提交评论点击事件
$(function() {

  // 设置豆瓣音乐评分图片的样式
  // 获取该音乐的豆瓣评分来设置图片的Y轴位置，显示相应评分对象的星星数
  var musicStar = Math.ceil($('.rating-num strong').html() - 10) * 15;
  $('.star').css('background-position-y', musicStar);

  $('.comment').click(function(e) {
    var target = $(this);                   // 获取点击回复的评论对象
    var toId = target.data('tid');          // 被评论人的ID值
    var commentId = target.data('cid');     // 该条评论内容的ID值
    $('#toId').val(toId);
    $('#commentId').val(commentId)
  });

  $('#submit').click(function(e) {
    e.preventDefault(); //- 阻止表单默认发送到服务器行为并发送Ajax请求

    $.ajax({
      type: 'POST',
      data: $('#commentForm').serialize(),  //- 序列化表单值
      url: '/user/music/comment'
    }).done(function(results) {
      if (results.success === 1) {
        window.location.reload();  //- 页面不刷新,待实现(动态插入dom节点里面去)
      }
    })
  });

  //删除评论功能
  $('#mediaList').on('click', '.comment-del', function(event) {
    var $omediaBody = $(this).parent('.media-body');       // 获取点击删除a元素的父节点
    var cid = $(event.target).data('cid');                 // 获取该删除评论的id
    // 如果点击的是叠楼中的回复评论还要获取该回复评论的自身id值
    var did = $(event.target).data('did');

    $.ajax({
      url: '/user/music/comment/:id?cid='+cid+'&did='+did,
      type: 'DELETE',
    }).done(function(results) {
      if(results.success === 1) {
        // 获取.media-body的父节点并删除
        $omediaBody.parent().remove();
      }
    })
  })
});