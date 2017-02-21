/**
 * 工厂模式
 *
 * 用来创建对象，使用工厂模式创建对象时无需指明对象的类型。
 * 工厂模式定义一个接口
 * 这个接口由子类决定实例化哪一个类
 * 子类实例化时，重写接口方法指定自己的对象类型。
 */

/**
 * 简单的实现
 */
var Car = (function(){
	/* 构造函数 */
	function Car(model, year, miles){
		this.model = model;
		this.year = year;
		this.miles = miles;
	}
	return function(model, year, miles){
		return new Car(model, year, miles);
	}
}())

/**
 * 另一个例子
 */
var productManager = {};
productManager.createProductA = function(args){
	this.name = args.name || "未命名商品";
	this.price = args.price || 999999;
}
productManager.createProductB = function(args){
	this.name = args.name || "未命名商品";
	this.count = args.count || 0;
}
productManager.Factory = function(typeType, args){
	return new productManager[typeType](args);
}