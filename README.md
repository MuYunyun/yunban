基于NodeJs+MongoDB搭建的云瓣电影音乐网站+微信端
========================================

简介:
---------------
**1. 项目后端搭建:**
  * 使用NodeJs的`koa`框架完成电影网站后端搭建;
  * 使用`mongodb`完成数据存储,通过`mongoose`模块完成对`mongodb`数据的构建;
  * 使用`jade`模板引擎完成页面创建渲染;
  * 使用`Moment.js`格式化电影存储时间;

**2. 项目前端搭建:**
  * 使用`jQuery`和`Bootsrap`完成网站前端JS脚本和样式处理;
  * 使用`Sass`完成电影和音乐首页样式的编写;
  * 使用`validate.js`完成对账号登录注册的判断;
  * 使用`fullpage.js`完成电影宣传页面制作;
  * 前后端的数据请求交互通过`Ajax`完成;
  * (音乐端部分模块、电影画廊部分)使用`React+ES6`进行组件化开发，并使用Webpack实现资源模块管理
  * 使用`canvas`并调用`webAudio api`完成音乐播放界面的制作
  
**3. 项目微信端搭建:**  
  * 使用`weui`框架构造详情界面
  * 各种api借口的实现（比如地理经纬度查询、拍照、扫码、上传素材等）
  * 调用jdk，实现语音查询电影 
  
**4. 本地开发环境搭建:**
  * 使用`gulp`集成`jshint`对JS语法检查，`Sass`文件编译、压缩等功能，使用`mocha`完成用户注册存储等步骤的简单单元测试，以及服务器的自动重启等功能。

  * 电影首页(实现了按热度、时间、评价、分类查询以及加载更多等功能模块)
  * 部分页面针对不同分辨率做了自适应；
  * 具有用户注册登录及管理;
  * 电影（音乐）可进行叠楼评论并可删除自己的评论(管理员能删除任何人);
  * 电影（音乐）及电影院信息录入和搜索;
  * 电影（音乐）分类添加及删除;
  * 电影（音乐）海报自定义上传;
  * 电影（音乐）可以自行上传;
  * 列表分页处理;
  * 访客统计;
  * 微信上通过语音（文字）搜电影;
  * 微信上实现与网页的评论同步;
  * 电影画廊页面的实现(数据从后台获得)；
  * 音乐播放界面实现(数据从后台获得)；
  
项目部分展示:
-------

  <img src="http://oegv7uazl.bkt.clouddn.com/yanshi.gif"  height="700" alt="电影手机网页端"/>
<img src="http://oegv7uazl.bkt.clouddn.com/yunban/movie.gif" alt="云瓣电影"/>
<img src="http://oegv7uazl.bkt.clouddn.com/yunban/music.gif" alt="云瓣电影"/>
如果加载不出来<a href="http://oegv7uazl.bkt.clouddn.com/yunban/movie.gif" target="\_blank">点我看电影演示</a>、<a href="http://oegv7uazl.bkt.clouddn.com/yunban/music.gif" target="\_blank">点我看音乐演示</a>、

项目页面:
-------

**电影界面:** 
- 电影宣传页:localhost:1234
- 电影首页:localhost:1234/movieIndex
- 电影画廊:localhost:1234/gallery
- 电影详情页:localhost:1234/movie/:id 
- 电影搜索页:localhost:1234/movie/results?q=xx

**音乐界面:** 
- 音乐首页:localhost:1234/musicIndex 
- 音乐详情页:localhost:1234/music/:id
- 音乐播放界面:localhost:1234/musicPlay
- 音乐搜索页:localhost:1234/music/results?q=xx

**用户后台页:**
- 用户注册页面: localhost:1234/signup
- 用户登陆页面: localhost:1234/signin
- 用户详情列表页: localhost:1234/admin/user/list

**电影后台页:**
- 后台录入页:localhost:1234/admin/movie/new
- 列表页:localhost:1234/admin/movie/list
- 分类录入页:localhost:1234/admin//movie/category/new
- 分类页:localhost:1234/admin/movie/category/list
- 电影院录入页:localhost:1234/admin/city/new
- 电影院列表页:localhost:1234/admin/city/list

**音乐后台页:**
- 后台录入页:localhost:1234/admin/music/new
- 列表页:localhost:1234/admin/music/list
- 分类录入页:localhost:1234/admin/music/category/new
- 分类列表页:loclahost:1234/admin/music/category/list
- 热门榜单列表页:localhost:1234/admin/music/programme/list

**微信界面**
- 该部分待完善


目前正在实现的点：
------
* 微信音乐端的跟进;
* 增加电影的app端;





