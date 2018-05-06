let axios = require('axios')
let request = require('request')
let fs = require("fs");
let path = require("path");
let movie = {};
let siteUrl = 'http://www.wobeiwo.cn';
// let siteUrl = 'http://localhost:81/wordpress';
let url = siteUrl + '/wp-json/wp/v2/';
let movieIdUrl = url + 'posts';
let updataID = [];
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
// 备份
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
	var uinfo = {username: 'lonny', password: '13879706221bibi'},
	tokenApi = siteUrl + '/wp-json/jwt-auth/v1/token',
	token = '',
	doPostArticle = function(articleData = {}, cb, errCb) {
    console.log('sssssss')
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
    // token = ''
		if (token) {
			doPostArticle(articleData, cb, errCb)
		} else {
			axios.post(tokenApi, uinfo).then((result) => {
				var res = result.data
        token = res.token
        console.log('token', token)
				doPostArticle(articleData, cb, errCb)
			}).catch(err => {
        console.log(err)
      })
		}
	},
  getCategories = function(params = {}, cb) { // 获取类目
    console.log('url ->', url+'categories')
		axios({
			method: 'get',
			url: url+'categories', // tags
			params: params
		}).then((response) => {
      cb(response.data)
		}).catch(err => {
      console.log(err)
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
let movieLength = require(list + "/movieLength.json");
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
let nub = 0;
let file, fileMove;
function start (nubs = 0) {
  nub = nubs
  // 读取文件目录
  let files = require(fileData[nub])
  analysis(files)
}
function analysis (files) {
  file = files
  file.length > 0 && movieId(file[0], 0)
}

// 判断是否已添加
function movieId (fileMoves, i1s) {
  console.log('判断是否已添加!');
  if (fileMoves.name[0] && fileMoves.img[0]) {
    var movieTitleName = fileMoves.name[0]
    var typeName = []
    var type = [classify[fileMoves.tages]]
    var arr = fileMoves['◎类　　别'] ? fileMoves['◎类　　别'].split('/') : []
    arr.forEach((item) => {
      if (classify[item]) {
        type.push(classify[item])
        typeName.push(item)
      }
    })
    if (typeName.length == 0) typeName = [fileMoves.tages]
    var title = '【' + typeName.join('/') + '】' + (fileMoves['◎年　　代'] || '') + ' ' + (fileMoves.name[1] ? (fileMoves.name[1].indexOf('集') > -1 ? ' 《' + fileMoves.name[0] + '》' + fileMoves.name[1] : fileMoves.name[1] + ' 《' + fileMoves.name[0] + '》') : ' 《' + fileMoves.name[0] + '》')
    if (title.indexOf('更新第') > -1) {
      title = /更新第.*集/.exec(title)[0] || title;
    } else if (title.indexOf('[') > -1) {
      title = /\[.*\]/.exec(title)[0] || title;
    }
    console.log('请求查看电影id>>>>', movieTitleName, title)
    axios({
			method: 'get',
			url: movieIdUrl, // tags
			params: {
        search: movieTitleName
      }
		}).then(function (res) {
        if (res.length > 0) {
          var name = fileMoves.img[0].split('/');
          name = name[name.length - 1];
          for (var i=0; i<res.length; i++){
            if (typeof title == 'string') {
              if (res[i].title.rendered.indexOf(title) > -1){
                  fileMoves.id = res[i].id;
                  console.log('res.tit:', res[i].title.rendered)
                }
            } else if (Array.isArray(title)) {
              var flag = true;
              for(var j = 0;j< title.length; j++) {
                if (res[i].title.rendered.indexOf(title[j]) == -1){
                  flag = false;
                }
              }
              if (flag) {
                fileMoves.id = res[i].id;
                console.log('res.tit:', res[i].title.rendered);
              }
            }
          }
        }
        forEach1(fileMoves, i1s);
    });
  } else {
    console.log('数据不全跳过','电影：' + fileMove.name[0] , '图片:' + fileMoves.img[0])
  }
}

function forEach1 (fileMoves, i1s) {
  [fileMove, i1] = [fileMoves, i1s];
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
      if (fileMove.id) {
        let postData = {
          id: fileMove.id,
          title: title,
          content: fileMove.html,
          date: (fileMove.time ? new Date(fileMove.time) : new Date()).toJSON(),
          date_gmt: (fileMove.time ? new Date(fileMove.time) : new Date()).toJSON() // 发布时间
        }
        console.log('g.postArticle------------------->')
        g.postArticle(postData, res => {
          console.log('修改成功 ->', (i1 + 1) + '/' + file.length, fileMove.tages, 'categories:' + type, fileMove.name[0], 'Update ID='+ res.id)
          updataID.push(res.id)
          forEachData()
        }, err => {
          console.log('修改失败', err)
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
            fileMove.id = res.id;
            forEachData()
          })
      }
    } else {
      forEachData()
    }
  }, 100)
}

function forEachData () {
  console.log('forEachData:', file.length + '>' + (i1 + 1), fileData.length + '>' + (nub + 1))
  if (file.length > i1 + 1) {
    forEach1(file[i1 + 1], i1 + 1)
  } else if (fileData.length > nub + 1) {
    start(nub + 1)
  } else {
    console.log('提交成功！运行回写JSON');
    cbJSON()
  }
}

// 回写JSON
function cbJSON() {
  let movieType = {};
  console.log('分析数据!!')
  fileData.forEach(item => {
    let arr = require(item)
    arr.forEach((obj, i) => {
      if (movieType[obj.tages]) {
        movieType[obj.tages].push(obj)
      } else {
        movieType[obj.tages] = [obj]
      }
    })
    console.log('开始回写template数据!!')
    for (let obj in movieType) {
      let listJSON = require(list + '/' + obj + '.json')
      console.log(obj, movieType[obj].length, listJSON.length)
      listJSON = listJSON.concat(movieType[obj])
      movieLength[obj] = movieLength[obj] ? movieLength[obj] + movieType[obj].length : listJSON.length;
      console.log(obj, movieType[obj].length, listJSON.length);
      fs.writeFileSync(list + '/' + obj + '.json', JSON.stringify(listJSON));
    }
    console.log('回写template数据结束!!')
  })
  console.log('开始回写movieLength数据!!')
  fs.writeFileSync(list + '/movieLength.json', JSON.stringify(movieLength));
  console.log('回写movieLength数据结束!!')
  // fs.writeFileSync('renewal/updataID.json', JSON.stringify(updataID));
  console.log('运行结束！！')
}