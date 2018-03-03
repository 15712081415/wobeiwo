let axios = require('axios')
let request = require('request')
let fs = require("fs");
let path = require("path");
let list = path.resolve('template'); // 列表
let movieList = require(list + "/movie.json");
let fileArr = []

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
    for (let objs in movieType) {
      let listJSON = require(list + '/' + objs + '.json')
      listJSON.concat(movieType[objs])
      fs.writeFileSync(list + '/' + objs + '.json', JSON.stringify(listJSON));
    }
  })
  fs.writeFileSync(list + '/movie.json', JSON.stringify(movieList));
  fs.writeFileSync('renewal/updataID.json', JSON.stringify(updataID));
  console.log('运行结束！！')
}