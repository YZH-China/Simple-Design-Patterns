/**
 * 单例模式
 *
 * 单例就是保证一个类只有一个实例
 * 实现的方法一般是先判断实例存在与否，如果存在直接返回
 * 如果不存在就创建了再返回
 * 这就确保了一个类只有一个对象实例
 */

/**
 * 对象字面量是最简单的单例形式
 * @type {Object}
 */
var mySingleton = {
	property1: "something",
	property2: "something else",
	method1: function(){
		console.log("hello world");
	}
}

/**
 * 对简单字面量对象的扩展，使得单例对象可以扩展私有属性
 * 疑似有误。
 * @return {[type]} [description]
 */
var mySingleton = function(){
	/* 私有变量 */
	var privateVarable = 'something private';
	function showPrivate(){
		return privateVarable;
	}

	/* 公有变量和方法（可以访问私有变量和方法）*/
	return {
		publicMethod: function(){
			showPrivate();
		},
		publicVar: 'the public can see this'
	}
};

/**
 * 上面的代码在一运行就会初始化
 * 我们希望在用到时才初始化对象
 * 则需要使用一个构造函数来实现
 */
var Singleton = (function(){
	var instantiated; //保存状态
	function init(){
		/* 定义单例代码 */
		return {
			publicMethod: function(){
				console.log('hello world');
			},
			publicProperty: 'test'
		}
	};

	return {
		getInstance: function(){
			if(!instantiated){
				instantiated = init();
			}
			return instantiated;
		}
	}
}())

/**
 * 在每次调用构造函数时判断是否存在实例
 * 将实例容器设置为类属性
 */
function Universe(){
	/* 判断是否存在实例 */
	if(typeof Universe.instance === 'object'){
		return Universe.instance;
	}

	/* 构造对象属性方法 */
	this.start_time = 0;
	this.bang = "big";

	//构造完成后 缓存
	Universe.instance = this;

	//隐式返回this
}

/**
 * 缓存this到容器中
 * 在构造函数中重写构造函数，返回容器对象
 */
function Universe(){
	//缓存对象
	var instance = this;

	//构造对象属性和方法
	this.start_time = 0;
	this.bang = "big";

	//重写构造函数
	Universe = function(){
		return instance;
	}
}

/**
 * 缓存this到容器对象中
 * 重写构造函数
 * 处理原型
 */
function Universe(){
	var instance;
	Universe = function Universe(){
		return instanse;
	}
	Universe.prototype = this;
	instance = new Universe();
	instanse.prototype = Universe;

	instance.start_time = 0;
	instanse.bang = "big";

	return instanse;
}