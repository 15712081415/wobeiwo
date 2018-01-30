let fs = require("fs");
let axios = require("axios");
let request = require("request");
let cheerio = require("cheerio");
let iconv = require('iconv-lite');
// path模块，可以生产相对和绝对路径
let path = require("path");
// 获取目录绝对路径
let list = path.resolve('./content'); // 列表
let image = path.resolve('./image'); // 存放文件夹

// 读取文件存储数组
let fileArr = [];
let errorIndex = {};
// 读取文件目录
fs.readdir(list,function(err,files) {
    if (err) {
        console.log(err);
        return;
    }
    let count = files.length;
    // console.log(files);
    let results = {};
    files.forEach(function (filename) {
        console.log('url',list + '/' + filename)
        let obj = require(list  + '/' + filename)
        fileArr.push({obj: obj, name: filename.split('.')[0]})
    });
    zhuaqu(6)
});

function zhuaqu (num = 0) {
  listCurr(num == 6 ? 773 : 0, fileArr[num].obj.length, num)
}

function listCurr(index, len, num){
  console.log('listCurr', index, len, fileArr[num].obj[index] && fileArr[num].obj[index].img && fileArr[num].obj[index].img.length > 0)
  if (fileArr[num].obj[index] && fileArr[num].obj[index].name && fileArr[num].obj[index].img && fileArr[num].obj[index].img.length > 0) {
    getImage(0, fileArr[num].obj[index].img.length >= 1 ? 1 : 0, num, index, len)
    return
  } else {
    if (len < index) {
      (num < fileArr.length) && (zhuaqu(num+1));
    } else {
      listCurr(index + 1, len, num)
    }
    return
  }
}

function getImage (i, l, num, index, len) {
  console.log('getImage', num + '_' + index + '_' + i)
  let flag = true
  let obj = fileArr[num].obj
  if (!obj[index].img[i] || errorIndex['' + num + index + i] >= 1) {
    judge();
    return
  }
  setTimeout(() => {
    if (flag) {
      errorIndex['' + num + index + i] ? (errorIndex['' + num + index + i]++) : (errorIndex['' + num + index + i] = 1) 
      getImage(i, l, num, index, len)
    }
    flag = false
  }, 10000)
  request({
    url: obj[index].img[i],
    encoding : null // 让body 直接是buffer
  }, (error, response, body) => {
    if (!flag) return;
    flag = false;
    console.log('imgURL ->', obj[index].img[i], obj[index].name[0]);
    if (!error && response.statusCode == 200) {
      let name1 = obj[index].img[i].split('/')
      let name2 = name1[name1.length - 1].split('.')
      let name3 = name2[name2.length - 1]
      let data = obj[index].time.substring(0,7)
      write(num + '_' + index + '_' + i + '.' + name3, data, body)
      judge()
    } else {
      console.log('errorIndex', errorIndex['' + num + index + i])
      if (errorIndex['' + num + index + i]) {
        judge()
        errorIndex['' + num + index + i]++
      } else {
        errorIndex['' + num + index + i] = 1
        getImage(i, l, num, index, len)
      }
    }
  })
  function judge() {
    console.log('judge', l == i + 1, len == index + 1, num < fileArr.length)
    if (l == i + 1) {
      if (len < index) {
        (num < fileArr.length) && (zhuaqu(num+1));
      } else {
        listCurr(index + 1, len, num)
      }
    } else {
      getImage (i + 1, l, num, index, len)
    }
  }
}

function write(name, data, body) {
  let url = image + '/' + data
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