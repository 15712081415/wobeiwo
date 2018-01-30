let fs = require("fs");
let axios = require("axios");
let request = require("request");
let cheerio = require("cheerio");
let iconv = require('iconv-lite');
//path模块，可以生产相对和绝对路径
let path = require("path");
//获取目录绝对路径
let image = path.resolve('./image'); // 存放文件夹

let imageData = [];
// 读取文件目录
fs.readdir(image,function(err,files) {
  if (err) {
      console.log(err);
      return;
  }
  let count = files.length;
  files.forEach((filename, index) => {
    let url = image + '\\' + filename
    console.log('url', url)
    fs.readdir(url, (err, filesList) => {
      if (err) {
        console.log(err);
        return;
      }
      filesList.forEach((list) => {
        imageData.push({url: url  + '\\' + list, name: filename + '&&' + list})
      })
      if (count == index + 1) { // 拿到所有图片执行
        cloneImg()
      }
    })
  });
});
// 复制图片到imageAll
function cloneImg () {
  imageData.forEach(item => {
    console.log('item.name', item.name)
    fs.appendFileSync('./imageAll/' + item.name, fs.readFileSync(item.url))
  })
}