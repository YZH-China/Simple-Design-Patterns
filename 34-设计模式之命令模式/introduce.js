/**
* 命令模式：
*
* 命令模式封装了一种方法调用方式，
* 可以用来对方法调用进行参数化处理和传输，
* 消除调用操作的对象和实现操作的对象之间的耦合。
*
* 结构：
* 1.命令对象是一个操作和调用这个操作的对象的结合体
* 2.命令对象有一个执行操作，用于调用所绑定的操作
*/

/**
* 具体场景：
* 网站用户可以进行一些与自己账户相关的操作，
* 比如关闭或停止某些广告。
* 我们打算使用命令模式来弱化界面元素和操作之间的耦合
*/
var Interface = function(){};
var adCommand = new Interface("adCommand", ['execute']);

/**
* 定义的每个类中，封装着广告的start方法和stop方法
* 称这样的类叫做命令类。
* 将对象方法的调用和实现彻底解耦。
* 实现用户界面和对象广告的隔离。
*/
var StopAd = function(adObject){
	this.ad = adObject;
}
StopAd.prototype.execute = function(){
	this.ad.stop();
}

var StartAd = function(adObject){
	this.ad = adObject;
}
StartAd.prototype.execute = function(){
	this.ad.start();
}

/**
* 获取广告对象
* 将每个广告对象绑定上面两个命令
* 并构建按钮对象
*/
var ads = getads();
for(var i = 0; i < ads.length; i += 1){
	var startCommand = new StartAd(ads[i]);
	var stopCommand = new StopAd(ads[i]);
	/**
	 * 规定UiButton构造函数有两个参数
	 * 1.按钮上的文字
	 * 2.命令对象
	 * 每个按钮点击时调用对应命令对象的execute函数
	 */
	new UiButton("Start" + ads[i].name, startCommand);
	new UiButton('Stop' + ads[i].name, stopCommand);
}


/**
* 还可以使用闭包来创建命令对象
*
* 这种方法无需具有execute方法的对象，
* 而是把想要执行的方法包装在闭包中。
* 这种方法不适合需要多个命令方法场合
*/
function makeStart(addObject){
	return function(){
		addObject.start();
	}
}
function makeStop(addObject){
	return function(){
		addObject.stop();
	}
}

var startCommand = makeStart(ads[0]),
	stopCommand = makeStop(abs[0]);
startCommand();
stopCommand();