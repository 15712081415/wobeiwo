let axios = require('axios')
let request = require('request')
let cheerio = require('cheerio') // 
let url = 'http://192.168.1.101:81/wordpress/wp-json/wp/v2/'
// let url = 'http://192.168.1.101:81/nodejs/movie.json'
let articleData = {
	slug: 'mytest',
	title: '解读特朗普访陆行程 习大大以超高规格接待给足特朗普面子？',
	content: '中美交锋朝鲜和贸易 当台湾不再是习特议题还有戏唱吗？',
	name: '杀手不冷', // 标题名称
	status: 'publish', // 发布状态 publish, future, draft, pending, private
	type: 'post',
	date: '2017-11-05T10:07:46.847Z',
	date_gmt: '2017-11-05T10:07:46.847Z', // 发布时间
	author: 1, // 作者id
	comment_status: 'open', // 是否开放评论 open, closed
	featured_media: 13, // 特色图片id
	ping_status: 'closed',
	sticky: false, // 置顶
	meta: [],
	categories: [1], // 分类id
	tags: [4] // 标签id
}
// postArticle()
let g = (function(){
	var uinfo = {username: 'lonny', password: '123456'},
	tokenApi = 'http://192.168.1.101:81/wordpress/wp-json/jwt-auth/v1/token',
	token = '',
	doPostArticle = function(articleData = {}) {
		axios({
			method: 'POST',
			url: url+'posts',
			headers: {'Authorization': "Bearer " + token},
			data: articleData
		}).then((response) => {
			console.log(response.data)
		});
	},
	postArticle = function(articleData = {}) { // 提交文章
		if (token) {
			doPostArticle(articleData)
		} else {
			axios.post(tokenApi, uinfo).then((result) => {
				var res = result.data
				token = res.token
				doPostArticle(articleData)
			})
		}
	},
	getCategories = function(params = {}) { // 获取类目
		axios({
			method: 'get',
			url: url+'categories', // tags
			params: params
		}).then((response) => {
			console.log(response.data)
		});
	},
	getTags = function(params = {}) { // 获取标签
		axios({
			method: 'get',
			url: url+'tags',
			params: params
		}).then((response) => {
			console.log(response.data)
		});
	}
	return {
		postArticle: postArticle,
		getCategories: getCategories,
		getTags: getTags
	}
})()
g.getCategories()
// g.getTags({'search': 'mysql'})

/*
$ = cheerio.load('<h2 class="title">Hello world</h2>');
$('h2.title').text('Hello there!');
$('h2').addClass('welcome');
console.log($.html());
*/