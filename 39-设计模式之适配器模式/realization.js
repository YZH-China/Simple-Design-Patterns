/**
 * 适配器模式
 *
 * 将一个类（对象）的接口（方法或属性）转化为客户希望的另一个接口（方法或属性）
 * 使得原本因为接口（方法或属性）不兼容的那些类（对象）可以一起工作
 */

/**
 * 来看一个例子
 * 这个例子中，定义了Duck类，有fly和quack方法
 * 还有Turkey类，有fly和gobble方法，
 * 如果我们需要Turkey类实例实现quack方法，
 * 可以复用Duck类的quack方法，但其内部仍调用gobble
 */

//首先定义两个类的抽象行为
var Duck = function(){};
Duck.prototype.fly = function(){
	throw new Error("该方法必须重写");
}
Duck.prototype.quack = function(){
	throw new Error("该方法必须重写");
}

var Turkey = function(){};
Turkey.prototype.fly = function(){
	throw new Error("该方法必须重写");
}
Turkey.prototype.gobble = function(){
	throw new Error = ("该方法必须被重写");
}

//由抽象类的子类实现具体行为
var WildTurkey = function(){
	Turkey.call(this); //属性继承
}
WildTurkey.prototype = new Turkey(); //原型继承
WildTurkey.prototype.fly = function(){ //重写fly
	console.log("飞翔的距离貌似有点短");
}
WildTurkey.prototype.gobble = function(){ //重写gobble
	console.log("咯咯！咯咯！");
}

var MallardDuck = function(){
	Duck.call(this);
}
MallardDuck.prototype = new Duck();
MallardDuck.prototype.fly = function(){
	console.log("可以飞行很远的距离！");
}
MallardDuck.prototype.quack = function(){
	console.log("嘎嘎！嘎嘎！");
}

//为了让WildTurkey也支持quack方法，
//我们需要一个新的WildTurkey适配器TrukeyAdapter
var TurkeyAdapter = function(oTurkey){
	Duck.apply(this);
	this.oTurkey = oTurkey;
}
TurkeyAdapter.prototype = new Duck(); //原型继承自Duck
TurkeyAdapter.prototype.quack = function(){
	this.oTurkey.gobble();
}
TurkeyAdapter.prototype.fly = function(){
	var nFly = 0,
		nLenFly = 5;
	while(nFly < nLenFly){
		this.oTurkey.fly();
		nFly += 1;
	}
}

//调用
var oMallardDuck = new MallardDuck();
var oWildTurkey = new WildTurkey();
var oTurkeyAdapter = new TurkeyAdapter(oWildTurkey);
//原有鸭子行为
oMallardDuck.fly();
oMallardDuck.quack();

//原有的火鸡行为
oWildTurkey.fly();
oWildTurkey.gobble();

//适配器火鸡的行为（火鸡调用鸭子的方法名称）
oTurkeyAdapter.fly();
oTurkeyAdapter.quack();

/**
 * 合适适配器模式的情况有哪些呢？
 * 1.使用一个已经存在的对象，但其方法或属性接口不符合你的要求。
 * 2.想要一个可复用的对象，可以与其他不相关的对象或不可见对象协同工作
 * 3.项使用已存在的接口，但不能每个都进行原型继承。
 */

/**
 * 适配器模式与一些模式很像，但有区别
 * 1.与桥接模式。桥接的出发点不同，桥接的目的是将接口和实现分离，适配器是改变一个已有对象的接口。
 * 2.与装饰者模式。装饰者增强对象的功能而不改变接口，其透明性更好，支持递归
 * 3.与代理模式。代理在不改变接口的情况下，为对象定义了一个代理。
 */