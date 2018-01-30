let fs = require("fs");
let axios = require("axios");
let request = require("request");
let cheerio = require("cheerio");
let iconv = require('iconv-lite');
//path模块，可以生产相对和绝对路径
let path = require("path");
let imageAll2 = path.resolve('./imageAll2')
let imageData = [];
// 读取文件目录
fs.readdir(imageAll2,function(err,files) {
  if (err) {
      console.log(err);
      return;
  }
  let count = files.length;
  files.forEach((filename, index) => {
    console.log('url', filename)
    let name = filename.split('&&')
    name.length > 1 && imageData.push({form: path.resolve('./imageAll2/' + filename ), to: path.resolve('./image/' + name[0] + '/' + name[1])})
    if (count == index + 1) { // 拿到所有图片执行
      cloneImg()
    }
  });
});
// 复制图片到imageAll
function cloneImg (index) {
  let i;
  for (i = index || 0; i < imageData.length; i++) {
    let item = imageData[i]
    console.log('item.name', item.to, i)
    try {
      fs.appendFileSync(item.to, fs.readFileSync(item.form))
    } catch (error) {
      setTimeout(() => {
        console.log('setTimeout', i)
        cloneImg(i)
      }, 100)
    }
  }
  // console.log('--->', fs.readFileSync(imageData[0].form))
  // // fs.writeFile(imageData[0].to, fs.readFileSync(imageData[0].form))
  // fs.appendFileSync(imageData[0].to, fs.readFileSync(imageData[0].form))
}
