let axios = require('axios')
let request = require('request')
let fs = require("fs");
let path = require("path");
let movie = {}
let siteUrl = 'http://localhost:81/wordpress'
let url = siteUrl + '/wp-json/wp/v2/'
let updataID = []
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
};
(function() {
  let url = path.resolve('backups/' + (new Date().toJSON().slice(0, 10)));
  fs.exists(url,function(exists){
      if(exists) {
        // fs.writeFile(url + '/' + name, body);
      } else {
        fs.mkdir(url, function(err){
          if (err) {
            console.error(err);
            return
          }
          // 读取文件目录
          let list = path.resolve('template');
          fs.readdir(list,function(err,files) {
            if (err) {
                console.log(err);
                return;
            }
            files.forEach(function (filename) {
              fs.writeFile(url + '/' + filename, fs.readFileSync(list + '/' + filename))
            });
          });
        });
      }
  });
})()
let g = (function(){
	var uinfo = {username: 'lonny', password: '123456'},
	tokenApi = siteUrl + '/wp-json/jwt-auth/v1/token',
	token = '',
	doPostArticle = function(articleData = {}, cb, errCb) {
		axios({
			method: 'POST',
			url: url+'posts' + (articleData.id ? '/' + articleData.id : ''),
			headers: {'Authorization': "Bearer " + token},
			data: articleData
		}).then((response) => {
      cb(response.data)
		}).catch(err => {
      errCb && errCb(err)
    });
	},
  postArticle = function(articleData = {}, cb, errCb) { // 提交文章
		if (token) {
			doPostArticle(articleData, cb, errCb)
		} else {
			axios.post(tokenApi, uinfo).then((result) => {
				var res = result.data
        token = res.token
				doPostArticle(articleData, cb, errCb)
			}).catch(err => {
        console.log(err)
      })
		}
	},
	getCategories = function(params = {}, cb) { // 获取类目
		axios({
			method: 'get',
			url: url+'categories', // tags
			params: params
		}).then((response) => {
      cb(response.data)
		});
	},
	getTags = function(params = {}, cb) { // 获取标签
		axios({
			method: 'get',
			url: url+'tags',
			params: params
		}).then((response) => {
      cb(response.data)
		});
	}
	return {
		postArticle: postArticle,
		getCategories: getCategories,
		getTags: getTags
	}
})()
let classifyFile = [
  '2017最新电影',
  '3D电影',
  '动画电影',
  '国剧',
  '国语配音电影',
  '微电影',
  'MP4手机电影',
  '日韩剧',
  '日韩电影',
  '欧美剧',
  '港台电影',
  '经典高清电影',
  '综艺节目'
]
let classify = {
  '2017最新电影': null,
  '3D电影': null,
  '动画电影': null,
  '国剧': null,
  '国语配音电影': null,
  '微电影': null,
  'MP4手机电影': null,
  '日韩剧': null,
  '日韩电影': null,
  '欧美剧': null,
  '港台电影': null,
  '经典高清电影': null,
  '综艺节目': null
} // 分类ID

//获取目录绝对路径
let list = path.resolve('template'); // 列表
let movieList = require(list + "/movie.json");
//读取文件存储数组
let fileArr = [];

// json数据
let fileData = [
  path.resolve('renewal/最新更新电影.json'),
  path.resolve('renewal/最新更新连续剧.json')
]
// 获取分类
g.getCategories({per_page: 50}, res => {
  res.forEach((item, i) => {
    classify[item.name] = item.id
  })
  for (let item in classify) {
    console.log('sss', item, classify[item])
  }
  start()
})

// 开始
function start (nub = 0) {
  // 读取文件目录
  let file = require(fileData[nub])
  analysis(file)
  function analysis (file) {
    file.length > 0 && forEach1(file[0], 0)
    function forEach1 (fileMove, i1) {
      setTimeout(() => {
        if (fileMove.name && fileMove.name[0] && fileMove.time) {
          let typeName = []
          let type = [classify[fileMove.tages]]
          let arr = fileMove['◎类　　别'] ? fileMove['◎类　　别'].split('/') : []
          arr.forEach((item) => {
            if (classify[item]) {
              type.push(classify[item])
              typeName.push(item)
            }
          })
          if (typeName.length == 0) typeName = [fileMove.tages]
          let title = '【' + typeName.join('/') + '】' + (fileMove['◎年　　代'] || '') + ' ' + (fileMove.name[1] ? (fileMove.name[1].indexOf('集') > -1 ? ' 《' + fileMove.name[0] + '》' + fileMove.name[1] : fileMove.name[1] + ' 《' + fileMove.name[0] + '》') : ' 《' + fileMove.name[0] + '》')
          let title1 = (fileMove['◎年　　代'] || '') + ' ' + (fileMove.name[1] ? (fileMove.name[1].indexOf('集') > -1 ? ' 《' + fileMove.name[0] + '》' + fileMove.name[1] : fileMove.name[1] + ' 《' + fileMove.name[0] + '》') : ' 《' + fileMove.name[0] + '》')
          for (let titleName in movieList) {
            if (titleName.indexOf('《' + fileMove.name[0] + '》') > -1 && (fileMove.name[1].split('更新')[0] ? titleName.indexOf(fileMove.name[1].split('[')[0]) > -1 : true)) {
                  fileMove.id = movieList[titleName][0]
                  console.log('已入库', titleName, fileMove.id)
              }
          }
          if (fileMove.id) {
            let postData = {
              id: fileMove.id,
              title: title,
              content: fileMove.html,
              date: (fileMove.time ? new Date(fileMove.time) : new Date()).toJSON(),
              date_gmt: (fileMove.time ? new Date(fileMove.time) : new Date()).toJSON() // 发布时间
            }
            console.log('g.postArticle------------------------------->')
            g.postArticle(postData, res => {
              console.log('修改成功 ->', (i1 + 1) + '/' + file.length, fileMove.tages, 'categories:' + type, fileMove.name[0], 'Update ID='+ res.id)
              updataID.push(res.id)
              forEachData()
            }, err => {
              console.log('修改失败', err.data)
              forEachData()
            })
          } else {
            let postData = {
                slug: fileMove.name[0],
                title: title,
                content: fileMove.html, // fileMove.html
                name: fileMove.name[0], // 标题名称
                status: 'publish', // 发布状态 publish, future, draft, pending, private
                type: 'post',
                date: (fileMove.time ? new Date(fileMove.time) : new Date()).toJSON(),
                date_gmt: (fileMove.time ? new Date(fileMove.time) : new Date()).toJSON(), // 发布时间
                author: 1, // 作者id
                comment_status: 'open', // 是否开放评论 open, closed
                // featured_media: 13, // 特色图片id
                ping_status: 'closed',
                sticky: false, // 置顶
                meta: [],
                categories: type, // 分类id
                tags: [] // 标签id
              };
              console.log('g.postArticle------------------------------->')
              g.postArticle(postData, res => {
                console.log('提交成功 ->', (i1 + 1) + '/' + file.length, fileMove.tages, 'categories:' + type, fileMove.name[0], fileData.length > nub + 1)
                fileMove.id = res.id
                movieList[title1] = [res.id, classify[fileMove.tages]]
                forEachData()
              })
          }
        } else {
          forEachData()
        }
        function forEachData () {
          console.log('forEachData:', file.length + '>' + (i1 + 1), fileData.length + '>' + (nub + 1))
          if (file.length > i1 + 1) {
            forEach1(file[i1 + 1], i1 + 1)
          } else if (fileData.length > nub + 1) {
            start(nub + 1)
          } else {
            console.log('结束！！')
            cbJSON()
          }
        }
      }, 1000)
    }
  }
}

// 回写JSON
function cbJSON() {
  let movieType = {} 
  fileData.forEach(item => {
    let arr = require(item)
    arr.forEach((obj, i) => {
      if (movieType[obj.tages]) {
        movieType[obj.tages].push(obj)
      } else {
        movieType[obj.tages] = [obj]
      }
    })
    for (let obj in movieType) {
      let listJSON = require(list + '/' + obj + '.json')
      console.log(obj, movieType[obj].length, listJSON.length)
      listJSON = listJSON.concat(movieType[obj])
      console.log(obj, movieType[obj].length, listJSON.length)
      fs.writeFileSync(list + '/' + obj + '.json', JSON.stringify(listJSON));
    }
  })
  fs.writeFileSync(list + '/movie.json', JSON.stringify(movieList));
  fs.writeFileSync('renewal/updataID.json', JSON.stringify(updataID));
  console.log('运行结束！！')
}