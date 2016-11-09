function $(s) {
  return document.querySelectorAll(s);
}

var lis = $('#list li');
var size = 32;

var box = $('#box')[0];
var height, width;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
box.appendChild(canvas);
var Dots = [];  //该数组保存canvas中各图形的x,y坐标以及他们的颜色
var line;

var mv = new MusicVisualizer({
  size: size,
  visualizer: draw() //接收获取音频频率的函数数组
});
for (var i = 0; i < lis.length; i++) {
  lis[i].onclick = function() {
    for (var j = 0; j < lis.length; j++) {
      lis[j].className = "";
    }
    this.className = "selected";
    mv.play("/media/music/" + this.title);
  }
}

function random(m, n) { // 随机生成两个数之间的数
  return Math.round(Math.random() * (n - m) + m);
}

function getDots() { //获取点的坐标信息和颜色信息
  Dots = [];
  for (var i = 0; i < size; i++) {
    var x = random(0, width);
    var y = random(0, height);
    var color = "rgba(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ",0)";
    Dots.push({
      x: x,
      y: y,
      dx: random(1, 4), //x坐标移动增量
      color: color,
      cap: 0 //柱状图上的小帽属性
    });
  }
}

function resize() { //动态改变canvas区域的宽高
  height = box.clientHeight;
  width = box.clientWidth;
  canvas.height = height;
  canvas.width = width;
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = (height > width ? width : height) / 30;
  line = ctx.createLinearGradient(0, 0, 0, height); //创建线性渐变
  line.addColorStop(0, "red");
  line.addColorStop(0.5, "yellow");
  line.addColorStop(1, "green");
  getDots();
}
resize();

window.onresize = resize;

function draw() { // 绘制矩形函数
  return function(del, ave) {  // 差值、平均值
    //console.log(del + '加' + ave);
    ctx.clearRect(0, 0, width, height); // 清除上次canvas,保证流畅效果
    var w = width / size;
    var cw = w * 0.6; // 矩形的宽度
    var capH = cw > 10 ? 10 : cw; // 小帽的高度
    ctx.fillStyle = line; // 每次点击矩形展示，会到矩形展示
    if (draw.type == 'dot' && ((del > 3 && ave > 30) || (ave > 50 && del > 0))) {  //产生星星效果
      var d = Math.round(del * (ave - 20) * 0.01) + 4;  // 一个星星的线条数
      for (var i = 0; i < d; i++) {
        var y = random(-height * 2, 3 * height);
        ctx.beginPath();
        ctx.moveTo(0, y);  //起点
        ctx.lineTo(width, height - y);  //到达位置
        ctx.strokeStyle = 'rgb(' + random(100, 250) + ',' + random(50, 250) + ',' + random(50, 100) + ')';
        ctx.stroke();
      }
      //if(del > 3){alert(del + ' == ' + ave)}
      //$('.type .selected').innerHTML = del + '=' + ave;
    }
    for (var i = 0; i < size; i++) {
      var o = Dots[i];
      if (draw.type === 'column') {
        var h = this[i] / 256 * height;
        ctx.fillRect(w * i, height - h, cw, h); //x轴坐标,y轴坐标,宽度(0.4留为间隙),高度
        ctx.fillRect(w * i, height - (o.cap + capH), cw, capH); //绘制小帽
        o.cap--;
        if (o.cap < 0) { // 没点击歌曲时小帽的初始位置
          o.cap = 0;
        }
        if (h > 0 && o.cap < h + 40) { // 保持小帽和矩形条的距离是40
          o.cap = h + 40 > height - capH ? height - capH : h + 40;
        }
      } else if (draw.type === 'dot') {
        ctx.beginPath(); // 表示要开始绘制，没有该方法会有连线
        var r = 10 + this[i] / 256 * (height > width ? width : height) / 10; //绘制圆的半径(设置最小值为10)
        ctx.arc(o.x, o.y, r, 0, Math.PI * 2, true);
        var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r); //创建径向渐变
        g.addColorStop(0, "#fff");
        g.addColorStop(1, o.color);
        ctx.fillStyle = g;
        ctx.fill();
        o.x += o.dx; // 圆向右移动
        o.x = o.x > width ? 0 : o.x; // 移到最右边时回到最左边
        //ctx.strokeStyle = "#fff";  //描边颜色
        //ctx.stroke(); //描边
      }
    }
  };
}

/* 切换柱状图或者点状的展现 */
draw.type = "dot"; // 在draw函数上绑定一个属性，默认展现柱状图
var types = $("#type li");
for (var i = 0; i < types.length; i++) {
  types[i].onclick = function() {
    for (var j = 0; j < types.length; j++) {
      types[j].className = "";
    }
    this.className = "selected";
    draw.type = this.getAttribute('data-type');
  }
}

$('#volume')[0].onmousemove = function() {
  mv.changeVolume(this.value / this.max); //频率
}
$('#volume')[0].onmousemove(); // 让它默认60生效