'use strict'

var Koa = require('koa')
var fs = require('fs')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var dbUrl = 'mongodb://localhost/imooc'

mongoose.connect(dbUrl)

//models loading
var models_path = __dirname + '/app/models'
var walk = function(path) { //遍历这个目录
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)

var menu = require('./wx/menu')
var wx = require('./wx/index.js')
var wechatApi = wx.getWechat()

wechatApi.deleteMenu().then(function() {
	return wechatApi.createMenu(menu)
})
.then(function(msg) {
	console.log(msg)
})

var app = new Koa()
var Router = require('koa-router') //引人路由模块
var router = new Router() //拿到一个路由的实例
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')  //解析post过来的数据
var User = mongoose.model('User')
var views = require('koa-views')
var moment = require('moment')

app.use(views(__dirname + '/app/views', {
  extension: 'jade',
  locals: {
    moment: moment
  }
}))

app.keys = ['imooc']  //设置session的keys
app.use(session(app))  //传入session的中间件 用cookie实现用户的会话状态
app.use(bodyParser())
app.use(function *(next) {  //预处理用户的信息来作同步
  var user = this.session.user

  if (user && user._id) {
    this.session.user = yield User.findOne({_id: user._id}).exec()
    this.state.user = this.session.user  //每个模板渲染的时候都会读到state
  }
  else {
    this.state.user = null
  }

  yield next
})

require('./config/routes')(router)

app
	.use(router.routes())  //让路由规则生效
	.use(router.allowedMethods())


app.listen(1234)
console.log('Listening 1234')