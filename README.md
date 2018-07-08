## 云瓣影音网站 && 微信端

### PC 端效果:

在线地址暂时访问不了(服务器到期)，截了两张 gif 图，如下：

* [电影界面演示](http://oegv7uazl.bkt.clouddn.com/yunban/movie.gif)
* [音乐界面演示](http://oegv7uazl.bkt.clouddn.com/yunban/music.gif)

### 微信端效果:

<div>
  <img src="http://oegv7uazl.bkt.clouddn.com/WechatIMG8.jpeg" width="30%" height="32%" float"left" height="700" alt="效果展示"/>
  <img src="http://oegv7uazl.bkt.clouddn.com/WechatIMG4.jpeg" width="30%" height="32%" float"left" height="700" alt="效果展示"/>
  <img src="http://oegv7uazl.bkt.clouddn.com/WechatIMG3.jpeg" width="30%" height="32%" float"left" height="700" alt="效果展示"/>
</div>
<div>
  <img src="http://oegv7uazl.bkt.clouddn.com/WechatIMG6.jpeg" width="30%" height="32%" float"left" height="700" alt="效果展示"/>
  <img src="http://oegv7uazl.bkt.clouddn.com/WechatIMG2.jpeg" width="30%" height="32%" float"left" height="700" alt="效果展示"/>
</div>

### Usage(食用手册)

项目重构 ing，如果需要可以先使用之前的[版本](https://github.com/MuYunyun/yunban/tree/v1.0)

```
mongod // 启动 mongodb

gulp   // 启动项目
```

补充：关于如何导入数据

* 项目目录下的 show/yunbanDB 为数据库文件，使用 `mongorestore -d yunbanDB --dir=数据库目录` 导入进数据库内，关于 mongodb 的使用，请参考[这篇文章](https://www.cnblogs.com/MuYunyun/p/5837840.html#_label3)

* 设置管理员账号，更改数据库，输入 `db.myTable.update({name:'账号名'},{$set:{role:100}})`

### Introduction:

这是一个全栈的项目，包含了 PC 端、微信端、服务端、数据库，各端技术栈如下。部分技术栈已经老旧，所以进行以下重构：

重构计划第一步：

- [ ] 将电影模块重构为 React + react-router + mobx
- [ ] 升级 koa 框架

重构计划第二步：

- [ ] 音乐模块重构
- [ ] ...

**1. pc端后端搭建:**
  * 使用 `koa` 框架搭建云瓣网站服务端;
  * 使用 `mongodb` 完成数据存储，通过 `mongoose` 模块完成对 `mongodb` 数据的构建;
  * 使用 `jade` 模板引擎完成页面创建渲染;

**2. 项目前端搭建:**
  * 使用 `jQuery` 和 `Bootsrap` 完成网站前端 JS 脚本和样式处理;
  * 使用 `Sass` 完成云瓣项目的样式编写;
  * (音乐端部分模块、电影画廊部分)使用 `React` 进行组件化开发，并使用 `Webpack` 实现资源模块管理
  * 使用 `canvas` 并调用 `webAudio api` 完成音乐播放界面的制作

**3. 项目微信端搭建:**
  * 使用 `weui` 框架构造详情界面
  * 多种 api 接口的实现（比如地理经纬度查询、拍照、扫码、上传素材等）
  * 调用 `jdk`，实现语音查询电影

**4. 本地开发环境搭建:**
  * 使用 `gulp` 集成 `jshint` 对 JS 语法检查，`Sass`文件编译、压缩等功能，使用 `mocha` 完成用户注册存储等步骤的简单单元测试，以及服务器的自动重启等功能。

**5. 一些功能模块:**
  * 电影首页(实现了按热度、时间、评价、分类查询以及加载更多等功能模块)
  * 部分页面针对不同分辨率做了自适应；
  * 具有用户注册登录及管理;
  * 电影画廊页面的实现(数据从后台获得)；
  * 音乐播放界面实现(数据从后台获得)；
  * 电影（音乐）可进行叠楼评论并可删除自己的评论(管理员能删除任何人);
  * 电影（音乐）及电影院信息录入和搜索;
  * 电影（音乐）分类添加及删除;
  * 电影（音乐）与所属分类都是一对多的关系；
  * 电影（音乐）海报自定义上传;
  * 电影（音乐）可以自行上传;
  * 列表分页处理，访客统计;
  * 微信上通过语音或文字搜电影;
  * 微信上实现与网页的评论同步;
  * 微信上能访问网页端；(并把电影画廊和音乐播放作为单独的菜单独立出来)

### Page:

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
- 猜猜电影页：/wechat/movie
- 微信电影界面: /wechat/movie/:id
- 微信音乐界面：/wechat/music/:id






