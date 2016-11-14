'use strict';

module.exports = {
	'button': [{
		'name': '云瓣TOP榜',
		'sub_button': [{
			'name': '电影TOP10',
			'type': 'click',
			'key': 'movie_hot'
		}, {
			'name': '音乐TOP10',
			'type': 'click',
			'key': 'music_hot'
		}, {
			'name': '经典电影',
			'type': 'click',
			'key': 'movie_classic'
		}, {
			'name': '经典音乐',
			'type': 'click',
			'key': 'music_classic'
		}]
	}, {
		'name': '云瓣小屋',
		'sub_button': [{
			'name': '小编推荐曲目',
			'type': 'click',
			'key': 'music_recommend'
		},{
			'name': '语音搜电影',
			'type': 'view',
			'url': 'http://www.wukunyao.cn/wechat/movie'
		},{
			'name': '云瓣电影画廊',
			'type': 'view',
			'url': 'http://www.wukunyao.cn/gallery'
		},{
			'name': '云瓣音乐天地',
			'type': 'view',
			'url': 'http://www.wukunyao.cn/musicPlay?catName=本周单曲榜最热'
		}]
	},{
		'name': '小贴士',
		'sub_button': [{
			'name': '更多资讯',
			'type': 'view',
			'url': 'http://muyunyun.cn'
		}, {
				'name': '帮助',
				'type': 'click',
				'key': 'help'
		}]
	}]
};