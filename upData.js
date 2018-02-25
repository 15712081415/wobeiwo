let axios = require('axios')
let request = require('request')
let fs = require("fs");
let path = require("path");
let movie = {}
// let cheerio = require('cheerio') // 
let siteUrl = 'http://localhost:81/wordpress'
let url = siteUrl + '/wp-json/wp/v2/'
// let url = 'http://localhost:81/nodejs/movie.json'
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
// ------------------------------------------------------------------
// sss 2017最新电影 1
// sss 3D电影 6
// sss 动画电影 7
// sss 国剧 10
// sss 国语配音电影 2
// sss 微电影 9
// sss MP4手机电影 8
// sss 日韩剧 11
// sss 日韩电影 14
// sss 欧美剧 12
// sss 港台电影 13
// sss 经典高清电影 5
// sss 综艺节目 15
// sss 传记 28
// sss 冒险 25
// sss 剧情 27
// sss 动作 19
// sss 历史 29
// sss 喜剧 18
// sss 国产电影 31
// sss 奇幻 21
// sss 幻想 23
// sss 恐怖 17
// sss 惊悚 26
// sss 战争 24
// sss 爱情 16
// sss 神秘 22
// sss 科幻 20
// sss 纪录 30
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

//读取文件存储数组
let fileArr = [];
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
function start () {
  // 读取文件目录
  fs.readdir(list,function(err,files) {
      if (err) {
          console.log(err);
          return;
      }
      let count = files.length;
      //console.log(files);
      let results = {};
      files.forEach(function (filename) {
          console.log('url',list + '/' + filename)
          let obj = list  + '/' + filename;
          fileArr[classifyFile.indexOf(filename.replace('.json',''))] = {obj: obj, name: filename};
      });
      analysis(0, 0)
  });
  function analysis (index1 = 0, index2 = 0) {
    console.log('analysis')
    forEach1(fileArr[index1], index1)
    index1 = 0
    function forEach1 (FileUrl, i1) {
      let file = {obj: require(FileUrl.obj), name: FileUrl.filename}
      console.log('forEach1')
      forEach2(file.obj[index2], index2)
      index2 = 0
      function forEach2 (fileMove, i2) {
        console.log('forEach2', (i1 + 1) + '/' + fileArr.length, (i2 + 1) + '/' + file.obj.length)
        if (fileMove.name && fileMove.name[0]) {
          let typeName = []
          let type = [classify[classifyFile[i1]]]
          let arr = fileMove['◎类　　别'] ? fileMove['◎类　　别'].split('/') : []
          arr.forEach((item) => {
            if (classify[item]) {
              type.push(classify[item])
              typeName.push(item)
            }
          })
          if (typeName.length == 0) typeName = [classifyFile[i1]]
          let title = '【' + typeName.join('/') + '】' + (fileMove['◎年　　代'] || '') + ' ' + (fileMove.name[1] ? (fileMove.name[1].indexOf('集') > -1 ? ' 《' + fileMove.name[0] + '》' + fileMove.name[1] : fileMove.name[1] + ' 《' + fileMove.name[0] + '》') : ' 《' + fileMove.name[0] + '》')
          let title1 = (fileMove['◎年　　代'] || '') + ' ' + (fileMove.name[1] ? (fileMove.name[1].indexOf('集') > -1 ? ' 《' + fileMove.name[0] + '》' + fileMove.name[1] : fileMove.name[1] + ' 《' + fileMove.name[0] + '》') : ' 《' + fileMove.name[0] + '》')
          if (movie[title1]) {
            movie[title1][1].indexOf(classifyFile[i1]) == -1 && movie[title1][1].push(classify[classifyFile[i1]])
            type = movie[title1][1]
            let postData = {
              id: movie[title1][0],
              categories: type
            }
            console.log('type', type)
            g.postArticle(postData, res => {
              console.log('修改成功 ->', (i1 + 1) + '/' + fileArr.length, (i2 + 1) + '/' + file.obj.length, 'categories:' + type, fileMove.name[0])
              fileMove.id = res.id || fileMove.id
              movie[title1] = [res.id || fileMove.id, type]
              forEachData()
            }, err => {
              console.log('修改失败 ->', err)
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
              g.postArticle(postData, res => {
                console.log('提交成功 ->', (i1 + 1) + '/' + fileArr.length, (i2 + 1) + '/' + file.obj.length, 'categories:' + type, fileMove.name[0])
                fileMove.id = res.id
                movie[title1] = [res.id, type]
                forEachData()
              }, err => {
                console.log('提交失败 ->',  (i1 + 1) + '/' + fileArr.length, (i2 + 1) + '/' + file.obj.length, 'categories:' + type, fileMove.name[0])
              })
          }
        } else {
          forEachData()
        }
        function forEachData () {
          if (file.obj.length - 1 > i2) {
            forEach2(file.obj[i2 + 1], i2 + 1)
          } else if (fileArr.length - 1 > i1) {
            forEach1(fileArr[i1 + 1], i1 + 1)
            fs.writeFile(list + '/' + classifyFile[i1] + '.json', JSON.stringify(file.obj));
            fs.writeFile(list + '/movie.json', JSON.stringify(movie));
          } else if (fileArr.length -1 == i1) {
            fs.writeFile(list + '/' + classifyFile[i1] + '.json', JSON.stringify(file.obj));
          }
        }
      }
    }
  }
}

