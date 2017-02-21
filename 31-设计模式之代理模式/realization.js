/**
 * 代理模式
 *
 * 顾名思义，代理就是帮别人做事。
 * 代理模式：为其他对象提供一种代理以控制对这个对象的访问。
 * 使得代理对象控制具体对象的引用。
 * 代理几乎可以是任何对象：文件、资源，内存中的对象等。
 */

/**
 * 加入小明要送小红玫瑰花，但不好意思（有困难）
 * 像委托我（代理对象）去送
 */

//声明美女类（小红是实例）
var Girl = function(name){
	this.name = name;
}

//这是帅哥类（小明是实例）
var boy = function(name, girl){
	this.girl = girl;
	this.name = name;
	this.sendGift = function(gift){
		console.log("Hi " + girl.name + "，" + this.name + "送你一个礼物：" + gift);
	}
}

//这是代理类（我是实例）
var ProxyYZH = function(name, girl){
	this.girl = girl;
	this.name = name;
	this.sendGift = function(gift){
		(new boy(name, girl)).sendGift(gift); //代理了送礼物的行为
	}
}
//调用方式
var proxy = new ProxyYZH("小明", new Girl("小红"));
proxy.sendGift("玫瑰花"); 