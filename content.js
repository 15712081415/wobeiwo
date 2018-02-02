let fs = require("fs");
let axios = require("axios");
let request = require("request");
let cheerio = require("cheerio");
let iconv = require('iconv-lite');
//path模块，可以生产相对和绝对路径
let path = require("path");
//获取目录绝对路径
let list = path.resolve('./list'); // 列表
let content = path.resolve('./content'); // 存放文件夹

//读取文件存储数组
let fileArr = [];

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
        let obj = require(list  + '/' + filename);
        fileArr.push({obj: obj, name: filename.split('.')[0]})
    });
    zhuaqu (fileArr[10].obj, fileArr[10].name, 10)
});
// zhuaqu([{"time":"2007-12-05","title":"[怪医黑杰克：两位神秘医师DVD国语配音][日本06神秘动画力作]","url":"http://www.hao6v.com/dy/2017-10-28/BoLiChengBao.html","name":""}], '测试')
let getUrl = {}
function zhuaqu (obj, name, num) {
    getHtml(0, obj.length)
    function getHtml(index, len){
        // console.log('url', obj[index].url)
        if (obj[index].download) return
        !getUrl[obj[index].url] && setTimeout(function () {
            getHtml(index, len)
        }, 10000)
        if (!getUrl[obj[index].url]) {
            request({
                url: obj[index].url,
                encoding : null // 让body 直接是buffer
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (obj[index].download) return
                    console.log('url ->', (index + 1) + '/' + obj.length, obj[index].name, name, num)
                    getUrl[obj[index].url] = 'a' + index
                    body =  iconv.decode(body, 'gb2312');
                    let $ = cheerio.load(body + '');
                    // 读取节点
                    let img = []
                    for(let i = 0;i<$('#endText img').length;i++){
                        img.push($('#endText img').eq(i).attr('src'))
                    }
                    obj[index].img = img;
                    for(let l = 0;l<$('#endText img').length;l++){
                        let str = $('#endText p').eq(l).text()
                        str.indexOf('◎译　　名') >  -1 && (obj[index]['◎译　　名'] = str.split('◎译　　名')[1].split('◎')[0].trim());
                        str.indexOf('◎片　　名') >  -1 && (obj[index]['◎片　　名'] = str.split('◎片　　名')[1].split('◎')[0].trim());
                        str.indexOf('◎年　　代') >  -1 && (obj[index]['◎年　　代'] = str.split('◎年　　代')[1].split('◎')[0].trim());
                        str.indexOf('◎产　　地') >  -1 && (obj[index]['◎产　　地'] = str.split('◎产　　地')[1].split('◎')[0].trim());
                        str.indexOf('◎类　　别') >  -1 && (obj[index]['◎类　　别'] = str.split('◎类　　别')[1].split('◎')[0].trim());
                        str.indexOf('◎语　　言') >  -1 && (obj[index]['◎语　　言'] = str.split('◎语　　言')[1].split('◎')[0].trim());
                        str.indexOf('◎上映日期') >  -1 && (obj[index]['◎上映日期'] = str.split('◎上映日期')[1].split('◎')[0].trim());
                        str.indexOf('◎片　　长') >  -1 && (obj[index]['◎片　　长'] = str.split('◎片　　长')[1].split('◎')[0].trim());
                        str.indexOf('◎导　　演') >  -1 && (obj[index]['◎导　　演'] = str.split('◎导　　演')[1].split('◎')[0].trim());
                        str.indexOf('◎主　　演') >  -1 && (obj[index]['◎主　　演'] = str.split('◎主　　演')[1].split('◎')[0].trim());
                        str.indexOf('◎简　　介') >  -1 && (obj[index]['◎简　　介'] = str.split('◎简　　介')[1].split('◎')[0].trim());
                    }
                    obj[index].download = []
                    for(let k=0; k<$('#endText table tr').length;k++){
                        let html = $('#endText table tr td').eq(k).html()
                        obj[index].download.push(html)
                    }
                    // console.log('url file ->', len)
                    if (len == index + 1) {
                        fs.writeFileSync(content + '/' + name + ".json", JSON.stringify(obj));
                        (num < fileArr.length) && (zhuaqu(fileArr[num+1].obj, fileArr[num+1].name, num+1));
                    } else {
                        getHtml(index + 1, len)
                    }
                } else if (getUrl[obj[index].url] != 'a' + index) {
                    console.log('err')
                    if (len == index + 1) {
                        fs.writeFileSync(content + '/' + name + ".json", JSON.stringify(obj));
                        (num < fileArr.length) && (zhuaqu(fileArr[num+1].obj, fileArr[num+1].name, num+1));
                    } else {
                        getHtml(index+1, len);
                    }
                    console.log("error");
                }
            });
        } else {
            if (len == index + 1) {
                fs.writeFileSync(content + '/' + name + ".json", JSON.stringify(obj));
                (num < fileArr.length) && (zhuaqu(fileArr[num+1].obj, fileArr[num+1].name, num+1));
            } else {
                getHtml(index + 1, len)
            }
        }
    }
}