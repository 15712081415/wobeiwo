let fs = require('fs');
// let axios = require("axios");
let request = require("request");
// let cheerio = require("cheerio");
// let iconv = require('iconv-lite');
//path模块，可以生产相对和绝对路径
let path = require("path");
//获取目录绝对路径
let list = path.resolve('./content'); // 列表
let content = path.resolve('./template'); // 存放文件夹

//读取文件存储数组
let fileArr = [];

// 排序
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
        let obj = JSON.parse(fs.readFileSync(list  + '/' + filename));
        // fileArr.push({obj: obj, name: filename})
        fileArr[classifyFile.indexOf(filename.replace('.json',''))] = {obj: obj, name: filename}
    });
    analysis()
});
function analysis () {
  fileArr.forEach((file, i1) => {
    console.log(i1 + '--->', file.name)
    file.obj.forEach((fileMove, i2) => {
      console.log(i1 + '--->', file.name)
      if (fileMove.name[0] && fileMove.img && fileMove.time) {
        fileMove.img = [fileMove.img[0]]
        fileMove.img.forEach((fileImage, i3) => {
          let name = fileImage ? fileImage.split('.') : [];
          if (name.length > 1) {
            fileMove.img[i3] = 'http://p241z2z4x.bkt.clouddn.com/' + fileMove.time.substring(0, 7) + '/' + i1 + '_' + i2 + '_' + i3 + '.' + name[name.length - 1]
          }
        })
        let url = ""
        fileMove.download.forEach(item => {
          url += "<li>" + item.split('\"').join("'") + "</li>"
        })
        let type = ''
        if (fileMove["◎类　　别"]) {
          type = fileMove["◎类　　别"].split('\"')[0]
        }
        fileMove.html = "<div class='infoWrap'>" +
        (fileMove.img[0] ? "<p align='center'><img src='"+ fileMove.img[0] +"' alt='" + fileMove.name[0] + "' onerror='javascript:this.style.display=\"none\"' /></p>" : "") +
        "<p class='clearfix'><span class='infoCol'>译名： <em>" + (fileMove.name[0] || "--") + "</em></span><span class='infoCol'>年代： <em>" + (fileMove["◎年　　代"] || '--') + "</em></span></p>" +
        "<p class='clearfix'><span class='infoCol'>类别： <em>" + type + "</em></span><span class='infoCol'>语言： <em>" + (fileMove["◎语　　言"] || "--") + "</em></span></p>" +
        "<p class='clearfix'><span class='infoCol'>片长： <em>" + (fileMove["◎片　　长"] || "--") + "</em></span><span class='infoCol'>导演： <em>" + (fileMove["◎导　　演"] ? fileMove["◎导　　演"].split("\n　　　　　　").join("<br />　　　") : "--") + "</em></span></p>" +
        (fileMove["◎主　　演"] ? "<p class='clearfix mt10'><span class='infoPre'>主演：</span><span class='infoCon'>" + fileMove["◎主　　演"].split("\n　　　　　　").join("<br />") + "</span></p>" : "--" ) +
        "<p class='clearfix mt10'><span class='infoPre'>剧情：</span><span class='infoCon'>" + (fileMove["◎简　　介"] || "--") + "</span></p>" +
        "</div>" +
        "<div class='downWrap'>" +
        "<h2 class='downTit'>下载地址</h2>" +
        "<ul class='downList'>" + url + "</ul>" +
        "</div>"
      }
    })
    fs.writeFile(content + '/' + file.name, JSON.stringify(file.obj));
  });
}