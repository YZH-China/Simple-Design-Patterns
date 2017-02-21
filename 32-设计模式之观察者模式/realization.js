/**
 * 观察者模式
 *
 * 又叫发布订阅模式（Publick/Subscribe）
 * 定义了一种一对多的关系
 * 让多个观察者对象监听某一个主题对象
 * 这个主题对象发生改变时就会通知所有观察者对象
 * 使观察者对象可以自动更新自己
 */

/**
 * 观察者模式的好处
 * 1.支持简单的广播通信，自动通知已经订阅过的对象。
 * 2.页面载入后目标对象很容易与观察者存在一种动态关联。
 * 3.目标对象与观察者之间的抽象耦合关系能够单独扩展重用
 */

/**
 * 总的来说观察者模式的使用场景就是：
 * 当一个对象的改变需要同时改变其他对象，并且不是道具体有多少对象需要改变的时候。
 * 观察者模式所做的工作就是在解耦，让耦合的双方依赖于抽象而不是具体。
 */

//实现 版本一
var pubsub = {};
(function(p){
	//实现三个方法，发布、订阅、退订。
	//订阅一定先行，才能发布。发布就是调用订阅的处理函数，并指定参数。
	
	var topics = {}, //该对象的属性名就是订阅的名称，属性值是一个数组，每个项就是一次订阅的实体对象，包含伊特tokon和callback
		subUid = -1; //订阅实例的token值，保证始终唯一。

	//发布函数
	p.publish = function(topic, args){
		//如果是未订阅的topic则直接返回
		if(!topics[topic]){
			return false;
		}
		setTimeout(function(){
			var subscribers = topics[topic],
				len = subscribers ? subscribers.length : 0;
			while(len--){
				console.log(len);
				subscribers[len].func(topic, args);
			}
		}, 0)

		return true;
	},
	//订阅方法
	p.subscribe = function(topic, func){
		//判断该发布名是否已存在，若不存在则新建
		if(!topics[topic]){
			topics[topic] = [];
		}

		var token = (++subUid).toString();
		topics[topic].push({
			token: token,
			func: func
		});

		return token;
	},
	//退订方法
	p.unsubscribe = function(token){
		for(var m in topics){
			if(topics[m]){
				for(var i = 0, j = topics[m].length; i < j; i += 1){
					if(topics[m][i].token === token){
						topics[m].splice(i, 1);
						return token;
					}
				}
			}
		}
	},
	p.showTopics = function(){
		return topics;
	}

}(pubsub));

//调用
//将订阅的返回值保存，方便退订
var newSubToken = pubsub.subscribe("sayhellow", function(topic, data){
	console.log(topic + ":" + data);
});

//发布
pubsub.publish('sayhellow', "afasdf");



//版本二
//使用原型特性实现一个观察者模式

//观察者对象构造函数
function Observer(){
	this.fns = [];
}
//将更新、订阅、退订方法写在观察者对象构造函数的原型上。
Observer.prototype = {
	//发布
	subscribe: function(fn){
		this.fns.push(fn);
	},
	//退订
	unsubscribe: function(fn){
		this.fns = this.fns.filter(function(el){if(el !== fn){
			return el;
		}})
	},
	//更新
	update: function(o, thisObj){
		var scope = thisObj || window;
		this.fns.forEach(function(value){
			value.call(scope, o);
		})
	}
};
//调用
var o = new Observer();
var f1 = function(data){console.log('Robbin:' + data + '，赶紧干活了')};
var f2 = function(data){console.log('Randall:' + data + '，找他加点工资去')};
o.update("Tom回来了");
o.unsubscribe(f1);
o.update("Tom回来了");


//实现 版本三
//如果想让多个对象都具有观察者发布订阅的功能
//我们可以定义一个通用函数，
//然后将该函数的功能应用到需要观察者功能的对象上。

//通用代码
var obverse = {
	//订阅
	addSubscriber: function(callback){
		this.subscribers[this.subscribers.length] = callback;
	},
	//退订
	removeSubscriber: function(callback){
		for(var i = 0; i < this.subscribers.length; i += 1){
			if(this.subscribers[i] === callback){
				//产生稀疏数组。
				delete (this.subscribers);
			}
		}
	},
	//发布
	publish: function(what){
		for(var i = 0; i < this.subscribers.length; i += 1){
			if(typeof this.subscribers[i] === 'function'){
				this.subscribers[i](what);
			}
		}
	},
	//将对象o赋予观察者功能
	make: function(o){
		for(var i in this){
			o[i] = this[i];
			o.subscribers = [];
		}
	}
};
//将make的了枚举性关闭
Object.defineProperty(obverse, 'make', {
	enumerable: false
})

//订阅两个对象，使用observer.make方法将这两个对象赋予观察者功能。
var blogger = {
	recommend: function(id){
		var msg = 'dudu 推荐了的帖子：' + id;
		this.publish(msg);
	}
};
var user = {
	vote: function(id){
		var msg = '有人投票了！ID=' + id;
		this.publish(msg);
	}
}
obverse.make(blogger);
obverse.make(user);
//调用
var tom = {
    read: function (what) {
        console.log('Tom看到了如下信息：' + what)
    }
};

var mm = {
    show: function (what) {
        console.log('mm看到了如下信息：' + what)
    }
};
// 订阅
blogger.addSubscriber(tom.read);
blogger.addSubscriber(mm.show);
blogger.recommend(123); //调用发布

//退订
blogger.removeSubscriber(mm.show);
blogger.recommend(456); //调用发布

//另外一个对象的订阅
user.addSubscriber(mm.show);
user.vote(789); //调用发布