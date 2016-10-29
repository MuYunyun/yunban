'use strict';

$(function() {
  $('#fullpage').fullpage({
    verticalCentered: false,      //内容是否垂直居中
    anchors: ['page1', 'page2', 'page3', 'page4'],
    navigation: true,
    slidesNavigation: true,
    afterLoad: function(anchorLink, index){
      if (index == 1) {
        $('.slide1').find('img').delay(500).animate({
          top: '50'
        }, 5000, 'easeOutExpo');
      }
      if (index == 4) {
        $('.section4').find('img').fadeIn(5000);
      }
    },
    onLeave: function(index, direction) {
      if (index == 1) {
        $('.slide1').find('img').delay(0).animate({
          top: '120%'
        }, 0, 'easeOutExpo');
      }
      if(index == '4'){
        $('.section4').find('img').fadeOut(2000);
      }
    }
  })
});