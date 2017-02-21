/**
 * 我们有一个间的播放列表，需要在点击单个连接的时候在该连接下方显示视频曲介绍以及play按钮，点击play按钮的时候播放视频
 * 我们需要监听a连接的点击事件
 * “全选/反选点击事件”和“play”点击事件
 */

/**
 * 代理模式适合以下场合：
 * 1.远程代理，为一个对象在不同域提供局部代表。
 * 2.虚拟代理，根据需要创建开销很大的对象，通过它来存放实例化需要很长时间的真实对象
 * 3.安全代理，用来控制真实对象的访问权限，一般用于对象应该有不同的访问权限
 * 4.智能指引，当只调用真实对象时，代理处理另一些事情。
 */

//自定义一个查找器
var $ = function(id){
	return document.getElementById(id);
}

//JSONP跨域访问
var http = {
	makeRequest: function(ids, callback){
		var url = "http://query.yahooapis.com/v1/public/yql?q=",
			sql = 'select * from music.video.id where ids IN ("%ID%")',
			fromat = "format=json",
			handler = "callback=" + callback,
			script = document.createElement('script');

		sql = sql.replace('%ID%', ids.join('","'));
		sql = encodeURIComponent(sql);

		url += sql + "&" + fromat + "&" + handler;
		script.src = url;

		document.body.appendChild(script);
	}
}

//代理对象
var proxy = {
	ids: [],
	delay: 50,
	timeout: null,
	callback: null,
	context: null,
	//设置请求的id 和 callback以便在播放的时候触发回调
	makeRqeuest: function(id, callback, context){
		//添加到队列
		this.ids.push(id);

		this.callback = callback;
		this.context = context;

		//设置timeout
		if(!this.timeout){
			this.timeout = setTimeout(function(){
				proxy.flush();
			}, this.delay)
		}
	},
	//触发请求，使用代理职责调用了http.makeRequest
	flush: function(){
		//proxy.handler为请求yahoo时的callback
		http.makeRequest(this.ids, 'proxy.handler');
		//请求数据以后，紧接着执行proxy.handler方法
		//清除timeout和队列
		this.timeout = null;
		this.ids = [];
	},
	handler: function(data){
		var i, max;
		//单个视频的callback调用
		if(parseInt(data.query.length, 10) === 1){
			proxy.callback.call(proxy.context, data.query.results.Video);
		}
		//多个视频的callback调用
		for(i = 0, max = data.query.results.Video.length; i < max; i += 1){
			proxy.callback.call(proxy.context, data.query.results.Video[i]);
		}
	}
}

//视频处理模块有三种子功能：获取信息、展示信息、播放视频
var videos = {
	//初始化播放器代码，开始播放
	getPlayer: function(id){
		console.log(id);
		return '' + 
			'<object width="400" height="255" id="uvp_fop" allwoFullScreen="true">' +
			'<param name="movie" value="http://d.yimg.com/m/up/fop/embeflv/swf/fop.swf" \/>' +
			'<param name="flaseVars" value="id=v"' + id +
			'&amp;eID=1301797&amp;lang=us&amp;enableFullScreen=0&amp;shareEnable=1"\/>' +
			'<param name="wmode" value="transparent"\/>' +
            '<embed ' +
            'height="255" ' +
            'width="400" ' +
            'id="uvp_fop" ' +
            'allowFullScreen="true" ' +
            'src="http://d.yimg.com/m/up/fop/embedflv/swf/fop.swf" ' +
            'type="application/x-shockwave-flash" ' +
            'flashvars="id=v' + id + '&amp;eID=1301797&amp;lang=us&amp;ympsc=4195329&amp;enableFullScreen=1&amp;shareEnable=1"' +
            '\/>' +
			'</object>';
	},

	//拼接信息显示内容，然后在append到li的底部里显示
	updateList: function(data){
		var id,
			html = '',
			info;

		if(data.query){
			data = data.query.results.Video;
		}
		id = data.id;
		html += '<img src="' + data.Image[0].url + '" width="50" \/>';
        html += '<h2>' + data.title + '<\/h2>';
        html += '<p>' + data.copyrightYear + ', ' + data.label + '<\/p>';
        if(data.Albul){
        	html += '<p>Album: ' + data.Album.Release.title + ',' + data.Album.Release.resleaseYear + '<br />';
        }
        html += '<p><a class="play" href="http://new.music.yahoo.com/videos/--' + id + '">&raquo; play<\/a><\/p>';
        info = document.createElement('div');
        info.id = "info" + id;
        info.innerHTML = html;
        $('v' + id).appendChild(info);
	},

	//获取信息并显示
	getInfo: function(id){
		var info = $("info" + id);

		if(!info){
			//执行代理职责，并传入videos.updateList回调函数
			proxy.makeRqeuest(id, videos.updateList, videos);
			return;
		}

		if(info.style.dispaly === "none"){
			info.style.dispaly = '';
		} else {
			info.style.dispaly = 'none';
		}
	}
};

//处理事件绑定
$("vids").onclick = function(e){
	console.log(e.target);
	//阻止默认事件
	if(typeof e.preventDefault === "function"){
		e.preventDefault();
	}
	var src, id;

	e = e || window.event;
	src = e.target || e.srcElement;

	//不是连接的话就不继续处理了
	if(src.nodeName.toUpperCase() !== "A"){
		return;
	}
	
	e.returnValue = false;

	id = src.href.split('--')[1];

	//如果点击的是已经产生视频区的连接的play，就开始播放
	if(src.callName === "paly"){
		console.log(1);
		src.parentNode.innerHTML = videos.getPalyer(id);
		return;
	}

	src.parentNode.id = 'v' + id;
	videos.getInfo(id);
}

//全选/反选的代码
$("toggle-all").onclick = function(e){
	var hrefs, i, max, id;

	hrefs = $('vids').getElementByTagName('a');
	for(i = 0, max = hrefs.length; i < max; i += 1){
		//忽略play连接
		if(hrefs[i].calssName === 'paly'){
			continue;
		}
		//忽略没有选择的项
		if(!hrefs[i].parentNode.firstChild.checked){
			continue;
		}
		id = hrefs[i].href.split('--')[1];
		hrefs[i].parentNode.id = "v" + id;
		videos.getInfo(id);
	}
}