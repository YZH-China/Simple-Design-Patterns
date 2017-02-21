/**
 * 装饰者模式
 *
 * 装饰者模式是继承的更有弹性的代替方案。
 * 用于包装同接口的对象，
 * 允许向方法添加行为，将方法设置成原始对象调用。
 * 通过重写添加新功能，在被装饰者前后加上自己的行为。
 *
 * 装饰者模式是实现继承的替代方案。
 * 在脚本运行时，添加子类行为会影响所有原有实例
 * 但装饰者却不尽然，他能给不同对象各自添加新行为
 */

/**
 * 作用：
 *
 * 装饰者模式为已有功能动态地添加更多功能的一种方式
 * 把每个要装饰的功能封装在单独的函数中
 * 然后用该函数包装要装饰的已有函数的对象
 * 优点是，将类（函数）的核心职责和装饰功能区分开。
 */

/**
 * 需要装饰的类（函数）
 */
function Macbook(){
	this.cost = function(){
		return 1000;
	}
}
//下面是用于装饰的“子类”
function Memory(macbook){
	this.cost = function(){
		return macbook.cost() + 75;
	}
}
function BlurayDrive(macbook){
	this.cost = function(){
		return macbook.cost() + 300;
	}
}
function Insurance(macbook){
	this.cost = function(){
		return macbook.cost() + 250;
	}
}
//用法
var myMacbook = new Insurance(new BlurayDrive(new Memory(new Macbook())));

/**
 * 不仅具有装饰者行为，同时可以调用下层对象的同名方法
 */
//被装饰类
function ConcreteClass(){
	this.performTask = function(){
		this.preTask();
		console.log("doing something");
		this.postTask();
	}
}
//抽象的装饰者类
function AbstractDecorator(decorated){
	this.performTask = function(){
		//在上层对象performTask中调用下层对象的perfomTask
		decorated.performTask();
	}
}
//实例化装饰者对象类
function ConcreteDecoratorClass(decorated){
	this.base = AbstractDecorator;
	this.base(decorated);

	decorated.preTask = function(){
		console.log("pre-calling..");
	}
	decorated.postTask = function(){
		console.log('post-calling');
	}
}
//用法
var concrete = new ConcreteClass();
var decorator1 = new ConcreteDecoratorClass(concrete);
var decorator2 = new ConcreteDecoratorClass(decorator1);