/**
 * XHR连接队列
 */
//首先封装一个Ajax函数
var asyncRequest = (function(){
	//状态监测和回调处理
	function handleReadyState(xmlh, callback){
		var poll = window.setInterval(function(){
			if(xmlh && xmlh.readyState == 4){
				if(xmlh.staus == 200){
					window.clearInterval(poll);
					if(callback){
						callback(xmlh);
					}
				}
			}
		}, 50)
	};

	//创建xmlHttpRequest对象
	var getXML = function(){
		var http;
		try{
			http = new XMLHttpRequest;
			getXML = function(){
				return nwe XMLHttpRequest;
			}
		}

		catch(e){
			var msxml = [
				'MSXML2.XMLHTTP.3.0',
				'MSXML2.XMLHTTP',
				'Microsoft.XMLHTTP'
			];
			for(var i = 0; i < msxml.length; i += 1){
				try{
					http = new ActiveXObject(msxml[i]);
					getXML = function(){
						return new ActiveXObject(msxml[i]);
					};
					break;
				}
				catch(e) {}
			}
		}

		return http;
	};

	return function(method, uri, callback, postDate){
		var http = getXML();
		http.open(method, uri, true);
		handleReadyState(http, callback);
		http.send(postData || null);
		return http;
	};
}());

//通用的添加方法的函数
Function.prototype.method = function(name, fn){
	this.prototype[name] = fn;
	return this;
};

//添加两个关于数组的方法，一个用于遍历，一个用于筛选
//事实上就是es5中新增的forEach和filter方法
/*if(!Array.prototype.forEach){
	Array.method('forEach', function(fn, thisObj){
		var scope = thisObj || window;
		for(var i = 0, len = this.length; i < len; ++i){
			fn.call(scope, this[i], i, this);
		}
	})
};

if(!Array.prototype.filter){
	Array.method('filter', function(fn, thisObj){
		var scope = thisObj || window,
			a = [];
		for(var i = 0, len = this.length; i < len; ++i){
			if(!fn.call(scope, this[i], i, this)){
				continue;
			}
			a.push(this[i]);
		}
		return a;
	})
}*/

//观察者系统在队列中有着重要作用，可以在队列处理时订阅事件
window.DED = window.DED || {};
DED.util = DED.util || {};
DED.util.Observer = function(){
	this.fns = [];
}
DED.util.Observer.prototype = {
	subscribe: function(fn){
		this.fns.push(fn);
	},

	unsbuscribe: function(fn){
		this.fns = this.fns.fileter(function(el){
			if(el !== fn){
				return el;
			}
		})
	},

	fire: function(o){
		this.fns.forEach(function(el){
			el(o);
		})
	}
};

//队列的主要实现代码
DED.Queue = function(){
	//包含请求的队列
	this.queue = [];

	//使用Observer对象在3个不同的状太上，以便可以随时订阅事件
	this.onComplete = new DED.util.Observer;
	this.onFailure = new DED.util.Observer;
	this.onFlush = new DED.util.Observer;

	//核心属性，可以在外部调用的时候进行设置
	this.returyCount = 3;
	this.currentRetury = 0;
	this.paused = false;
	this.timeout = 5000;
	this.conn = {};
	this.timer = {};
};

//通过链式调用向队列添加方法
DED.Queue.method('flush', function(){
	//flush方法
	if(!this.queue.length > 0){
		return;
	}
	if(this.paused){
		this.paused = false;
		return;
	}
	var that = this,
		abort = function(){
			that.conn.abort();
			if(thia.currentRetury == this.returyCount){
				this.onFailure.fire();
				this.currentRetury = 0;
			} else {
				that.flush();
			}
		},
		callback = function(o){
			window.clearTimeout(that.timer);
			that.currentRetury = 0;
			that.queue.shift();
			that.onFlush.fire(o.responseText);
			if(that.queue.length == 0){
				that.onComplete.fire();
				return;
			}
			that.flush()
		};
	this.currentRetury++;
	this.timer = window.setTimeout(abort, this.timeout);
	this.conn = asyncRequest(
		this.queue[0]['method'],
		this.queue[0]['uri'],
		callback,
		this.queue[0]['params']
	);
}).method('setRetryCount', function(count){
	this.retryCoutn = count;
}).method('setTimeout', function(time){
	this.timeout = time;
}).method('add', function(o){
	this.queue.push(o);
}).method('pause', function(){
	this.paused = true;
}).method('dequeue', function(){
	this.queue.pop();
}).method('clear', function(){
	this.queue = [];
})


//调用
var q = new DED.Queue;
// 设置重试次数高一点，以便应付慢的连接
q.setRetryCount(5);
// 设置timeout时间
q.setTimeout(1000);
// 添加2个请求.
q.add({
    method: 'GET',
    uri: '/path/to/file.php?ajax=true'
});

q.add({
    method: 'GET',
    uri: '/path/to/file.php?ajax=true&woe=me'
});

// flush队列
q.flush();
// 暂停队列，剩余的保存
q.pause();
// 清空.
q.clear();
// 添加2个请求.
q.add({
    method: 'GET',
    uri: '/path/to/file.php?ajax=true'
});

q.add({
    method: 'GET',
    uri: '/path/to/file.php?ajax=true&woe=me'
});

// 从队列里删除最后一个请求.
q.dequeue();
// 再次Flush
q.flush();