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
let errJSON=[];
let errNext=[0,0];
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
    zhuaqu(11, 6471)
});

function zhuaqu (num = 0, index) {
  errNext = [num, index]
  listCurr(index || 0, fileArr[num].obj.length, num)
}

function listCurr(index, len, num){
  console.log('listCurr', index, len, num)
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

function getImage (i, l, num, index, len, setTime = 0) {
  let obj = fileArr[num].obj
  let name1 = obj[index].img[i].split('/')
  let name2 = name1[name1.length - 1].split('.')
  let name3 = name2[name2.length - 1]
  let data = obj[index].time.substring(0,7)
  let url = image + '/' + data
  url = url + '/' + num + '_' + index + '_' + i + '.' + name3
  let flag = true;
  setTimeout(() => {
    flag && setTime < 1 && getImage(i, l, num, index, len, 1)
  }, 30000)
  fs.access(url,function (exists) {
    if(exists && exists.code == 'ENOENT') {
      request({
        url: obj[index].img[i],
        rejectUnauthorized: false,
        encoding : null // 让body 直接是buffer
      }, (error, response, body) => {
        flag = false
        // console.log('response', response)
        if (!error && response.statusCode == 200) {
          console.log('imgURL ->', obj[index].img[i], obj[index].name[0]);
          write(num + '_' + index + '_' + i + '.' + name3, data, body)
          judge()
          return
        } else {
          console.log('失败 ->' + ((response && response.statusCode) || 'null'), obj[index].img[i], obj[index].name[0], error);
          errJSON.push({
            url: obj[index].img[i],
            fileName: num + '_' + index + '_' + i + '.' + name3,
            year: data
          })
          fs.writeFile(image + '/errJSON.json', JSON.stringify(errJSON));
          if (errorIndex['' + num + index + i]) {
            judge()
            return
          } else {
            errorIndex['' + num + index + i] = true
            getImage(i, l, num, index, len)
          }
        }
      })
    } else {
      flag = false
      console.log('已有图片：', url)
      judge()
      return
    }
  })
  function judge() {
    // if (errNext[0] != num || errNext[1] > index) {
    //   console.log('judge ---------------->',errNext[0] + ' != ' + num, errNext[1] + ' != ' + index)
    //   return
    // }
    if (l == i + 1) {
      if (len < index) {
        errNext[0] = num + 1
        console.log('errNext[0]', errNext[0])
        (num < fileArr.length) && (zhuaqu(num+1));
      } else {
        errNext[1] = index + 1
        console.log('errNext[1]', errNext[1])
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