var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(express)
var port = process.env.PORT || 3000
var app = express()
var fs = require('fs')
var dbUrl = 'mongodb://localhost/imooc'

mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
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
app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.multipart())
app.use(express.session({
  secret: 'imooc',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.use(express.logger(':method :url :status'))
  app.locals.pretty = true
  //mongoose.set('debug', true)
}

require('./config/routes')(app)

app.listen(port)
app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname, 'public')))

console.log('imooc started on port ' + port)

