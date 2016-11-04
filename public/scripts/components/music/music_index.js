'use strict';
import NewAlbums from './NewAlbums';  // 引入新碟榜React组件
import HotProgrammes from './HotProgrammes';         // 引人近期热门歌单组件
import ArtistSongs from './ArtistSongs';           // 引人本周单曲榜组件

$.support.cors = true;

$(function() {
  // 音乐主页函数
  var musicIndexFun = (function() {
    var oCol6_width = $('.col-md-6').width();  //获取主页左边区域布局对象
    /* 顶部轮播图区 #galleryFrames */
    var galleryFrames = (function() {
      var page = 1,                                          // 页码变量
          $oLeft = $('#galleryFrames .slide-prev'),          // 向左箭头
          $oRight = $('#galleryFrames .slide-next'),         // 向右箭头
          $oUl = $('#galleryFrames .gallery-hot ul'),         // 获取轮播图列表对象
          len = $('#galleryFrames .slide-content li').length, // 总共热门推荐轮播图数量
          $oDots = $('#galleryFrames .slide-dots');           // 获取轮播图滑动点列表对象

      $oUl.width(oCol6_width * len);  // 设置热门推荐区轮播图片的总宽度
      $('#galleryFrames img').width(oCol6_width);   // 设置每张轮播图片li的宽度

      // 轮播滚动函数，对作用方向进行不同移动
      function galleryMov(direction) {
        if(!$('oUl').is(':animated')) {
          if(direction === 'right') {          //向右移动
            if(page === len) {           //在最右边继续往右滚回到最左边
              page = 1;
              // 设置显示当前电影页码
              $oUl.animate({left:0},500);
            }else {                            //不在最右边的情况
              page ++;
              // 找到单击元素所在电影滚动面板元素
              $oUl.animate({left:'-='+oCol6_width},500); //逻辑有点绕
            }
            // 切换圆点导航样式
            $oDots.find('li:eq('+ (page-1) +')').addClass('slide-active').siblings().removeClass('slide-active');
          }else {   //向左移动
            if(page === 1) {                   //在最左边继续往左滚回到最右边
              page = len;
              $oUl.animate({left:'-='+oCol6_width * (len-1)},500);
            }else {
              page --;                         //不在最左边的情况
              $oUl.animate({left:'+='+oCol6_width},500);
            }
            // 切换圆点导航样式
            $oDots.find('li:eq('+ (page-1) +')').addClass('slide-active').siblings().removeClass('slide-active');
          }
        }
      }
      // 向右切换
      $oRight.on('click', function() {
        galleryMov('right');
      });
      // 向左切换
      $oLeft.on('click', function() {
        galleryMov('left');
      });
      // 定时器，电影展示区每隔5s向右滚动一次
      var timer = setInterval(function() {
        galleryMov('right');
      },5000);
      // 当鼠标划入电影展示区时动画停止，移开时重新开始运动
      $('#galleryFrames').on('mouseover',function() {
        clearInterval(timer);
      }).on('mouseout',function() {
        timer = setInterval(function() {
          galleryMov('right');
        },5000);
      });
      // 轮播图滑动点对象点击事件
      $oDots.on('click', 'li', function() {
        $(this).addClass('slide-active').siblings().removeClass('slide-active');
        var pageDiff = $(this).text() - page;  // 获取需要滚动的页数
        page = $(this).text();  //将当前点击也赋值给page变量
        $oUl.animate({
          left: '-=' + oCol6_width * pageDiff
        }, 300);   // 滚动到当前点击页
      })
    })();

    /* 编辑推荐区事件 */
    var editorFeatured = (function() {
      var $oEditorScreen = $('#editorFeatured .screen-body'),    // 获取编辑推荐区对象
          page = 1,    // 初始页码
          $oLeft = $('#editorFeatured .slide-prev'),       // 获取左按钮
          $oRight = $('#editorFeatured .slide-next'),      // 获取右按钮
          oThumbnail = $('#editorFeatured .thumbnail'),    // 获取音乐对象
          len = oThumbnail.length,                // 获取音乐数量
          pageCount = Math.ceil(len / 4),         // 编辑推荐区总页数
          // 每张海报的外边距及实际赋给每张海报内容宽度
          marginWidth = oThumbnail.outerWidth(true) - oThumbnail.outerWidth(),
          oThumbnailWidth = (oCol6_width - marginWidth * 4) / 4;

      // 设置每张海报的宽带
      oThumbnail.outerWidth(oThumbnailWidth);
      // 设置编辑推荐区总宽度
      $oEditorScreen.width(oCol6_width * pageCount);
      $('#editorFeatured .ui-side-max').html(pageCount);

      // 点击编辑推荐区右箭头
      $oRight.on('click',function() {
        funMoving('right');
      });
      //点击左箭头
      $oLeft.on('click',function() {
        funMoving('left');
      });
      // 定时器，电影展示区每隔5s向右滚动一次
      var timer = setInterval(function() {
        funMoving('right');
      },5000);
      // 当鼠标划入电影展示区时动画停止，移开时重新开始运动
      $('#editorFeatured').on('mouseover',function() {
        clearInterval(timer);
      }).on('mouseout',function() {
        timer = setInterval(function() {
          funMoving('right');
        },5000);
      });

      // 编辑推荐区滚动函数
      function funMoving(direction) {
        // 获取整个编辑滚动区宽度
        var pageWidth = (pageCount - 1) * oCol6_width;
        // 设置编辑推荐区当前页码
        var $editorIndex = $('#editorFeatured .ui-side-index');
        // 判断是否有滚动动画在执行，防止动画叠加
        if(!$oEditorScreen.is(':animated')) {
          if(direction === 'right') {          //向右移动
            if(page === pageCount) {           //在最右边继续往右滚回到最左边
              page = 1;
              // 设置显示当前音乐页码
              $editorIndex.html(page);
              $oEditorScreen.animate({left:0},400);
            }else {                            //不在最右边的情况
              page ++;
              $editorIndex.html(page);  //设置显示当前音乐页码
              // 找到单击元素所在音乐滚动面板元素
              $oEditorScreen.animate({left:'-='+oCol6_width},400); //逻辑有点绕
            }
          }else {   //向左移动
            if(page === 1) {                   //在最左边继续往左滚回到最右边
              page = pageCount;
              $editorIndex.html(page);
              $oEditorScreen.animate({left:'-='+pageWidth},400);
            }else {
              page --;                         //不在最左边的情况
              $editorIndex.html(page);
              $oEditorScreen.animate({left:'+='+oCol6_width},400);
            }
          }
        }
      }

    })();
  })();
});