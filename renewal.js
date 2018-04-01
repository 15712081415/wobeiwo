let axios = require("axios");
let request = require("request");
let cheerio = require("cheerio");
let iconv = require('iconv-lite');
let fs = require("fs");
let path = require("path");
let template = path.resolve('./template');
// let movieList = require(template + "/movie.json");
let renewal = path.resolve('./renewal');
let dateTime = '2018-02-25' || new Date().toJSON().slice(0,10) // 设置更新日期 [01-16]
let urlM = {} // 过滤重复url请求
let movieLength = {} // 当前电影数
let movieMap = {}
let fileUrl = [
  'http://www.hao6v.com/gvod/zx.html', // 最新电影
  'http://www.hao6v.com/gvod/dsj.html' // 最新连续剧
]
let errorImage = []
let classifyFile = [
  '2017最新电影',
  '日韩电影',
  '港台电影',
  '综艺节目',
  '欧美剧',
  '日韩剧',
  '国剧',
  'MP4手机电影',
  '3D电影',
  '动画电影',
  '经典高清电影',
  '微电影',
  '国语配音电影'
]
let classifyFile2 = [
  '2017最新电影',
  '日韩电影',
  '港台电影',
  '综艺',
  '欧剧.美剧连载',
  '日剧.韩剧连载',
  '国产剧.港台剧连载',
  '手机MP4电影',
  '3D电影',
  '动画电影',
  '经典高清电影',
  '微电影',
  '国语配音电影'
];

// 备份文件backups
(function() {
  let url = path.resolve('backups/' + (new Date().toJSON().slice(0, 10)));
  fs.exists(url,function(exists){
      if(exists) {
        // 有备份不做处理
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
})();


let fileArr = []; // json文件
let number = 0;
let nub = 0; // 0: 更新最新电影， 1：更新连续剧
let curYear = new Date().getFullYear();
analysis();
// 获取最新列表
function analysis () {
  number = 0
  let fileData = []
  getHtml(fileUrl[nub], body => {
    body =  iconv.decode(body, 'gb2312');
    let $ = cheerio.load(body + '');
    let list = $("#main .box .list li")
    for (let i=0;i<list.length;i++){
      let item = list.eq(i);
      let n1 = item.find('a').text().split("《");
      let n2 = n1[1] ? (n1[1] + '').split("》") : '';
      let obj = {
        time: filterTime(item.find('span').text()),
        title: item.find('a').text(),
        url: item.find('a').attr('href'),
        name: n2
      }
      dateTime < obj.time && obj.url && obj.name && fileData.push(obj)
    }
    if (fileData.length > 0 ) {
      getMovie(fileData)
    } else {
      console.log(dateTime + '后无更新')
    }
  })
}

// 获取电影信息页面
function getMovie (fileData) {
  forEach1(fileData[0], 0, fileData.length)
  function forEach1 (item, index, length) {
    console.log('item', index, item.url)
    let yearMonth = item.time.slice(0,7);
    getHtml(item.url, body => {
      body =  iconv.decode(body, 'gb2312');
      let $ = cheerio.load(body + '');
      let t = 0;
      (() => {
         let tit = $("#main .box .t a").eq(1).text()
         let i = 0
        classifyFile2.forEach((item, index) => {
          if (tit.indexOf(item) > -1) i = index
        })
        t = i
      })()
      let movie = require(template + '/' + classifyFile[t] + '.json')
      let data = item
      movie.forEach(M => {
        if (M.name[0] == item.name[0]) {
          M.time = item.time
          M.name[1] = item.name[1] || ''
          data = M
        }
      })
      data.tages = classifyFile[t]
      if (!movieLength[data.tages]) movieLength[data.tages] = movie.length - 1      
      if (!movieMap[data.tages]) {
        movieMap[data.tages] = new Map()
        movieMap[data.tages].set(index, data.title)
      } else {
        movieMap[data.tages].set(index, data.title)
      }
      console.log('index-----', 'movieLength[data.tages]:' + movieLength[data.tages], 'movieMap[data.tages].size:' + movieMap[data.tages].size)
      data.index = movieMap[data.tages].size + movieLength[data.tages]
      // 读取节点
      let img = []
      img.push($('#endText img').eq(0).attr('src'))
      data.img = img;
      // 下载图片
      let [name1,name2,name3] = []
      name1 = data.img[0] ? data.img[0].split('/') : '.'
      name2 = name1[name1.length - 1].split('.')
      name3 = name2[name2.length - 1]
      data.imageName = t + '_' + data.index + '_0.' + name3 || '';
      (function (data) {
        getHtml(data.img[0], body => {
          write(data.imageName, yearMonth, body)
        }, function (url, error) {
          errorImage.push({url: url || data.img[0], name: data.imageName, time: yearMonth, error: error})
        }, function () {
          console.log('imageNext', data.name[0])
          if (length - 1 > index) {
            forEach1(fileData[index + 1], index + 1, length)
          } else {
            console.log('结束！！', (index + 1) + '/' + length)
          }
        })
      })(data)
      for(let l = 0;l<$('#endText>p').length;l++){
          let str = $('#endText>p').eq(l).text() || ''
          // console.log('str', str)
          str.indexOf('◎译　　名') >  -1 && (data['◎译　　名'] = str.split('◎译　　名')[1].split('◎')[0].trim());
          str.indexOf('◎片　　名') >  -1 && (data['◎片　　名'] = str.split('◎片　　名')[1].split('◎')[0].trim());
          str.indexOf('◎年　　代') >  -1 && (data['◎年　　代'] = str.split('◎年　　代')[1].split('◎')[0].trim());
          str.indexOf('◎产　　地') >  -1 && (data['◎产　　地'] = str.split('◎产　　地')[1].split('◎')[0].trim());
          str.indexOf('◎类　　别') >  -1 && (data['◎类　　别'] = str.split('◎类　　别')[1].split('◎')[0].trim());
          str.indexOf('◎语　　言') >  -1 && (data['◎语　　言'] = str.split('◎语　　言')[1].split('◎')[0].trim());
          str.indexOf('◎上映日期') >  -1 && (data['◎上映日期'] = str.split('◎上映日期')[1].split('◎')[0].trim());
          str.indexOf('◎片　　长') >  -1 && (data['◎片　　长'] = str.split('◎片　　长')[1].split('◎')[0].trim());
          str.indexOf('◎导　　演') >  -1 && (data['◎导　　演'] = str.split('◎导　　演')[1].split('◎')[0].trim());
          str.indexOf('◎主　　演') >  -1 && (data['◎主　　演'] = str.split('◎主　　演')[1].split('◎')[0].trim());
          str.indexOf('◎简　　介') >  -1 && (data['◎简　　介'] = str.split('◎简　　介')[1].split('◎')[0].trim());
      }
      console.log('年代', data['◎年　　代'])
      let typeName = []
      let type = [classifyFile2[classifyFile[t]]]
      let arr = data['◎类　　别'] ? data['◎类　　别'].split('/') : []
      arr.forEach((item) => {
        if (classifyFile2[item]) {
          type.push(classifyFile2[item])
          typeName.push(item)
        }
      })
      if (typeName.length == 0) typeName = [classifyFile[t]]
      data.title = '【' + typeName.join('/') + '】' + (data['◎年　　代'] ? data['◎年　　代'] + ' ' : '') + (data.name[1] ? (data.name[1].indexOf('集') > -1 ? ' 《' + data.name[0] + '》' + data.name[1] : data.name[1] + ' 《' + data.name[0] + '》') : ' 《' + data.name[0] + '》')
      // for (let titleName in movieList) {
      //   if (titleName.indexOf('《' + data.name[0] + '》') > -1 && (data.name[1].split('更新')[0] ? titleName.indexOf(data.name[1].split('[')[0]) > -1 : true)) {
      //         data.id = movieList[titleName][0]
      //         console.log('已入库', titleName, data.id)
      //     }
      // }
      data.download = []
      for(let k=0; k<$('#endText table tr').length;k++){
          let html = $('#endText table tr td').eq(k).html()
          data.download.push(html)
      }
      // 生成html
      if (data.name[0] && data.img && data.time) {
        data.img = [data.img[0]]
        data.img.forEach((fileImage, i3) => {
          let name = fileImage ? fileImage.split('.') : [];
          if (name.length > 1) {
            data.img[i3] = 'http://p241z2z4x.bkt.clouddn.com/' + yearMonth + '/' + data.imageName
          }
        })
        let url = ""
        data.download.forEach(item => {
          url += "<li>" + item.split('\"').join("'") + "</li>"
        })
        let type = ''
        if (data["◎类　　别"]) {
          type = data["◎类　　别"].split('\"')[0]
        }
        data.html = "<div class='infoWrap'>" +
        (data.img[0] ? "<p align='center'><img src='"+ data.img[0] +"' alt='" + data.name[0] + "' onerror='javascript:this.style.display=\"none\"' /></p>" : "") +
        "<p class='clearfix'><span class='infoCol'>译名： <em>" + (data.name[0] || "--") + "</em></span><span class='infoCol'>年代： <em>" + (data["◎年　　代"] || '--') + "</em></span></p>" +
        "<p class='clearfix'><span class='infoCol'>类别： <em>" + type + "</em></span><span class='infoCol'>语言： <em>" + (data["◎语　　言"] || "--") + "</em></span></p>" +
        "<p class='clearfix'><span class='infoCol'>片长： <em>" + (data["◎片　　长"] || "--") + "</em></span><span class='infoCol'>导演： <em>" + (data["◎导　　演"] ? data["◎导　　演"].split("\n　　　　　　").join("<br />　　　") : "--") + "</em></span></p>" +
        "<p class='clearfix mt10'><span class='infoPre'>主演：</span><span class='infoCon'>" + (data["◎主　　演"] ? data["◎主　　演"].split("\n　　　　　　").join("<br />") + "</span></p>" : "--" ) +
        "<p class='clearfix mt10'><span class='infoPre'>剧情：</span><span class='infoCon'>" + (data["◎简　　介"] || "--") + "</span></p>" +
        "</div>" +
        "<div class='downWrap'>" +
        "<h2 class='downTit'>下载地址</h2>" +
        "<ul class='downList'>" + url + "</ul>" +
        "</div>"
      }
      console.log('url file ->', index)
      fileArr.push(data)
      number++
      if (number + 1 == fileData.length) {
        fs.writeFileSync(renewal + '/最新更新'+ (nub == 0 ? '电影' : '连续剧') +'.json', JSON.stringify(fileArr));
        fs.writeFileSync(renewal + '/'+ (nub == 0 ? '电影' : '连续剧') +'错误图片.json', JSON.stringify(errorImage));
        if (nub == 0) {
          nub = 1
          fileArr = []
          analysis()
        }
      }
    }, null, function () {
      if (length - 1 > index) {
        forEach1(fileData[index + 1], index + 1, length)
      } else {
        console.log('结束！！', (index + 1) + '/' + length)
      }
    })
  }
}

function getHtml(url, cb, err, next){
  if (urlM[url]) {
    return
  }
  if (!url) {
    err && err(url)
    next && next()
    return
  }
  let flag = true
  setTimeout(() => {
    if (flag) {
      getHtml(url, cb, err, next)
    }
  }, 20000)
  request({
    url: url,
    rejectUnauthorized:false,
    encoding : null // 让body 直接是buffer
    }, function (error, response, body) {
        flag = false
        if (!urlM[url]) {
          urlM[url] = true
        } else {
          return
        }
        if (!error && response.statusCode == 200) {
          cb(body)
        } else {
          console.log('访问失败', url, error)
          err && err(url, error)
        }
        next && next()
      }
    )
}

// 保存图片
function write(name, data, body) {
  let url = renewal + '/image' + '/' + data
  name = name.split('?')[0]
  fs.exists(url,function(exists){  
      if(exists) {
        fs.writeFile(url + '/' + name, body);
      } else {
        fs.mkdir(url,function(err){
          if (err) {
            console.error(err);
            return
          }
          fs.writeFile(url + '/' + name, body);
        });
      }
  });
}

// 过滤格式化时间
function filterTime (date) {
  if (/^\[\d{1,2}-\d{1,2}\]$/.test(date)) {
    let str = date.replace('[', '').replace(']', '');
    return curYear+'-'+str
  } else {
    return date;
  }
}