var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var port = process.env.PORT || 3000
var app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)  //会话的持久化
var logger = require('morgan')
var multipart = require('connect-multiparty')
var fs = require('fs')
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

app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public'))) //静态文件配置的目录
app.use(cookieParser())
app.use(session({
  secret: 'imooc',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({
  	url: dbUrl,
  	collection: 'sessions' //存到mongodb里collection的名字
  })
}))
app.use(multipart())  //文件表单

//项目初始配置
var env = process.env.NODE_ENV || 'development'
if ('development' === env) {  //开发环境
	app.set('showStackError', true) //屏幕上显示错误
	app.use(logger(':method :url :status')) 
	app.locals.pretty = true  //可读性
	mongoose.set('debug', true)
}

require('./config/routes')(app)

app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port ' + port)





