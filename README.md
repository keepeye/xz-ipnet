IP地理位置查询
--------------

### 安装

	npm install xz-ipnet --save

### 普通用法

	var ipnet = require('xz-ipnet')();
	console.log(ipnet.find("180.109.81.135"));
	//output: [ '中国', '江苏', '南京', '' ]

### koa用法

	var ipnet = require('xz-ipnet')();
	var koa = require('koa');

	const app = new koa();
	//将ipnet对象加到ctx中，方便全局调用
	//ipnet一次将dat文件加载到内存中，不会每次请求都加载dat文件
	app.use(async function(ctx,next) {
	  ctx.ipnet = ipnet;
	  await next();
	});

	app.use(async function(ctx){
		ctx.body = ipnet.find("180.109.81.135") || 'null';
	})

### 自定义字典文件

本模块采用的是 ipip.net 的免费版ip数据库，格式为dat文件，默认有一个位于包根目录下。

然而考虑到地址库可能会更新，可指定dat文件。

	var ipnet = require('xz-ipnet')('./newip.dat');

### 关于地址库

由于是免费版，所以只精确到市，不包含行政区，不过整体文件就比较小，特别适合特定的场景。

### 我再说两句

由于时间关系，就没写单元测试，不过也就那么一个方法，测试了几个ip还是ok，我项目中也在用，出问题第一时间修复。
