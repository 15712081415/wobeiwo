let axios = require('axios')
let request = require('request')
let fs = require("fs");
let path = require("path");
let list = path.resolve('template'); // 列表
let movieList = require(list + "/movie.json");
let fileArr = []
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
          fileArr.push({obj: obj, name: filename});
      });
      content()
 });
function content () {
	fileArr.forEach(FileUrl => {
		console.log(1)
		let file = require(FileUrl.obj)
		console.log(2)
		file.forEach(movie => {
			if (movie.id) {
				for (let item in movieList) {
					if (movie.title && movie.title.indexOf(item) > -1) {
						console.log(item, movie.id)
						movieList[item] = movie.id
						console.log(6)
					}
				}
			}
		})
	})
	fs.writeFile(list + '/movie.json', JSON.stringify(movieList));
}
