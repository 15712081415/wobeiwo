let axios = require("axios");
let request = require("request");
let cheerio = require("cheerio");
let iconv = require('iconv-lite');
let fs = require("fs");
let path = require("path");
let list = path.resolve('./list');
let nub=0;
let Furl = [
	// "http://www.hao6v.com/dy/",
	// "http://www.hao6v.com/s/jingdiandianying/",
	// "http://www.hao6v.com/s/gangtaidianying/",
	// "http://www.hao6v.com/zy/",
	// "http://www.hao6v.com/mj/",
	// "http://www.hao6v.com/rj/",
	// "http://www.hao6v.com/dlz/",
	// "http://www.hao6v.com/s/shoujiMP4dianying/",
	// "http://www.hao6v.com/3D/",
	// "http://www.hao6v.com/jddy/",
	// "http://www.hao6v.com/gq/",
    // "http://www.hao6v.com/zydy/",
	"http://www.hao6v.com/gydy/"
];
let classifyFile = [
    // '2017最新电影',
    // '日韩电影',
    // '港台电影',
    // '综艺节目',
    // '欧美剧',
    // '日韩剧',
    // '国剧',
    // 'MP4手机电影',
    // '3D电影',
    // '动画电影',
    // '经典高清电影',
    // '微电影',
    '国语配音电影'
  ]
let t;
let listData = [
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
]
function getHtml(url, index, err, name1){
    console.log('indexKS', index , url, err, name1)
    let flag = true
    function t (index2) {
        setTimeout(() => {
            flag && getHtml(url, index, err, name1)
        }, 10000)
    }
    t()
    request({
		url: url,
		encoding : null // 让body 直接是buffer
    }, function (error, response, body) {
        flag = false
        if (!error && response.statusCode == 200) {
			body =  iconv.decode(body, 'gb2312');
            let $ = cheerio.load(body + '');
			let page= $('#main .box .listpage b').eq(0);
            let objs = $("#main .box .list li");
            let t = $("#main .box .t a").eq(1);
            let name = classifyFile[nub]
			page = (page.text() + '').split("/")
            let str = ''
			if (index == 0) str += '{body: [';
			if (index > 0) str += ',';
			for (let i=0;i<objs.length;i++){
            	let item = objs.eq(i);
				let n1 = item.find('a').text().split("《");
				let n2 = n1[1] ? (n1[1] + '').split("》") : '';
                let obj = {
                    time: item.find('span').text(),
                    title: item.find('a').text(),
                    url: item.find('a').attr('href'),
					name: n2
                }
                listData[nub].push(obj)
			}
            if (page[0] != page[1]) {
            	console.log('1', Furl[nub], nub)
                index++
                console.log('index1', index)
                getHtml(Furl[nub] + 'index_' + (index+1) + '.html', index, page[1], name);
            } else {
                fs.writeFile(list + '/' + name1 + ".json", JSON.stringify(listData[nub]));
                nub++
                if (nub < Furl.length) getHtml(Furl[nub], 0);
			}
		} else {
        	console.log('err', err, name1, error, response, body)
        	if (err == index + 1) {
                fs.writeFile(list + '/' + name1 + ".json", JSON.stringify(listData[nub]));
                nub++
                if (nub < Furl.length) getHtml(Furl[nub], 0);
			} else {
                console.log('index1', index)
                getHtml(Furl[nub] + 'index_' + (index + 1) + '.html', index, err, name1);
			}
			console.log("error");
		}
	});
}
getHtml(Furl[nub], 0);




