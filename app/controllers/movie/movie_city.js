'use strict';

var mongoose = require('mongoose'),
    City = mongoose.model('City'),
    CityCategory = mongoose.model('CityCategory'),
    CityProgramme = mongoose.model('CityProgramme');

exports.new = function *(next) {
  var cities = yield City.find({}).exec();
  var cityCategories = yield CityCategory.find({}).exec();
  var cityProgrammes = yield CityProgramme.find({}).exec();
  yield this.render('pages/movie/movie_city_admin', {
    title: '豆瓣电影后台影院录入页',
    logo: 'movie',
    city: {},
    cities: cities || [],
    cityCategories: cityCategories || [],
    cityProgrammes: cityProgrammes || []
  });
};

// 数据存储控制器
exports.save = function *() {
  var cityObj = this.request.body.city,                    // 获取城市录入页发送的数据
      cityId = cityObj.cityId,                             // 所选城市ID
      cityName = cityObj.cityName,                         // 新建城市名称
      cinemas = cityObj.cinemas,                           // 新建电影院名称
      cityCategoryName = cityObj.cityCategoryName,         // 新建城市分类名称
      cityCategoryId = cityObj.cityCategoryId,             // 所选城市ID
      cityProgrammeName = cityObj.cityProgrammeName,       // 新建城市分类归类名称
      cityProgrammeId = cityObj.cityProgrammeId;           // 所选分类归类的ID

  // 如果输入了城市归类名称
  if(cityProgrammeName) {
    var _cityProgramme = yield CityProgramme.findOne({name: cityProgrammeName}).exec();
    // 如果归类已存在
    if(_cityProgramme) {
      console.log('城市分类归类已存在');
      this.redirect('/admin/city/new');
    }else {    // 新建分类归类
      var newCityProgramme = new CityProgramme({
        name: cityProgrammeName              // 城市分类名称
      });
      yield newCityProgramme.save();
      this.redirect('/admin/city/new');
    }
  }else if (cityProgrammeId) {    // 如果选择了分类归类
    var _oldCityProgramme = yield CityProgramme.findOne({_id: cityProgrammeId}).exec();
    //如果输入了城市分类名称
    if(cityCategoryName) {
      var _cityCategory = yield CityCategory.findOne({name: cityCategoryName}).exec();
      if (_cityCategory) {  //城市分类已存在
        console.log('城市分类已存在');
        this.redirect('/admin/city/new');
      }else {  //新建城市分类
        var newCityCategory = new CityCategory({
          name: cityCategoryName     //城市分类名称
        });
        newCityCategory.cityProgramme = cityProgrammeId;  // 分类归类属性指向当前归类
        _oldCityProgramme.cityCategories.push(newCityCategory._id);
        yield newCityCategory.save();
        yield _oldCityProgramme.save();
        this.redirect('/admin/city/new');
      }
    }
    // 如果没有创建或选择城市分类则创建失败 重定向到当前页面
    else {
      console.log('需要添加城市分类');
      this.redirect('/admin/city/new');
    }
  }else if (cityCategoryId) {   // 如果选择了城市分类ID
    if (cityName) { // 如果输入了城市名称
      var _city = yield City.findOne({name: cityName}).exec();
      if (_city) {
        console.log('城市已存在');
        this.redirect('/admin/city/new');
      }else {
        var newCity = new City({
          name: cityName
        });
        var cityCategoryArray = [];
        // 判断选择了几个城市分类，如果只选择一个，则cityCategoryId值为String，否则为Array
        if (typeof cityCategoryId === 'string') {
          cityCategoryArray.push(cityCategoryId);
        }
        else {
          cityCategoryArray = cityCategoryId;
        }
        for(var i = 0; i < cityCategoryArray.length; i++) {
          var _oldCityCategory = yield CityCategory.findOne({_id: cityCategoryArray[i]}).exec();
          if (_oldCityCategory) {
            newCity.cityCategories.push(_oldCityCategory._id);
            _oldCityCategory.cities.push(newCity._id);
            yield _oldCityCategory.save();
            yield newCity.save();
          }
        }
        this.redirect('/admin/city/new');
        // this.redirect('/admin/city/list');
      }
    }else {
      console.log('需要添加城市名称');
      this.redirect('/admin/city/new');
    }
  }else if (cityId) {   // 如果选择了城市名
    // 如果输入了电影院名称
    if (cinemas) {
      var _city = yield City.findOne({_id: cityId}).exec();
      // 如果该城市中电影院不存在 则添加到该城市的cinemas属性中并保存
      if (_city.cinemas.indexOf(cinemas) === -1) {
        _city.cinemas.push(cinemas);
        yield _city.save();
        // this.redirect('/admin/city/list');
        this.redirect('/admin/city/new');
      }else{
        console.log('电影院已存在');
        this.redirect('/admin/city/new');
      }
    }else {
      console.log('需输入电影院名称');
      this.redirect('/admin/city/new');
    }
  }else {  // 其余操作均无法添加数据
    console.log('录入电影院数据失败');
    this.redirect('/admin/city/new');
  }
};

// 电影院列表控制器
exports.list = function *(next) {
  var cityCategoryList = yield CityCategory.find({})
      .populate('cities', 'name cinemas')
      .populate('cityProgramme', 'name')
      .exec();
  yield this.render('pages/movie/movie_city_list', {
    title: '豆瓣电影影院分类列表页',
    cityCategoryList: cityCategoryList,
    logo: 'movie'
  })
};

// 电影院列表删除控制器
exports.del = function *(next) {
  var id = this.query.id;
  if (id) {
    var _cityCategory = yield CityCategory.findOne({_id: id}).exec();   // 查找该条城市分类
    var _cityProgramme = yield CityProgramme.findOne({_id: _cityCategory.cityProgramme}).exec();  // 查找该城市分类所对应的归类
    // 将该分类从归类的数组中删除并保存
    var index = _cityProgramme.cityCategories.indexOf(id);
    _cityProgramme.cityCategories.splice(index, 1);
    yield _cityProgramme.save();
    var cityArray = [];
    // 判断删除城市分类中包含几个城市，如果只有一个，则_cityCategory.cities值为String，否则为Array
    if (typeof _cityCategory.cities === 'string') {
      cityArray.push(_cityCategory.cities);
    }else {
      cityArray = _cityCategory.cities;
    }
    // 将该分类下存储的城市都删除
    for(var i = 0; i < cityArray.length; i++) {
      yield City.remove({_id:cityArray[i]});
    }
    // 删除该城市分类
    yield CityCategory.remove({_id: id});
    this.body = {success: 1};
  }
};