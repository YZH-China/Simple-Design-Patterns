/**
 * 单例一般是用在系统间各种模块的通信协调上。
 * 下面是一个小的实现
 */

//SingletonTester是一个全局访问点
var SingletonTester = (function(){
	/* 实例构造函数，支持继承、原型方法等 */
	function Singleton(args){
		//缓存参数对象
		var args = args || {};
		this.name = args.name;
		this.pointX = args.pointX || 0;
		this.pointY = args.pointY || 0;
	}

	//实例容器
	var instance;

	var _static = {
		name: "SingletionTester",
		getInstance: function(args){
			if(instance === undefined){
				instance = new Singleton(args);
			}
			return instance;
		}
	};

	return _static;
}());