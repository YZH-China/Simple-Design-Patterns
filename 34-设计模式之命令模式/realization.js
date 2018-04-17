/**
 * 命令模式
 *
 * 代理、调用者、接收者
 * 命令模式系统中有三个参与者：
 * 1.代理-client
 * 		负责实例化命令，并将其交给调用者（instroducez中，for循环内部代码就是客户）
 * 2.调用者-invoking
 * 		接过命令并保存下来。
 * 		在某个时间调用该命令对象的execute方法，或交给另一个潜在的调用者
 * 		introuduce中的UiButton类实例就是调用者
 * 3.接收者-reveiving
 * 		调用者进行commandObject.exectue调用时，
 * 		转而以recevier.action()形式调用，
 * 		instruction中的广告对象就是接收者
 */

/**
 * 以一个接口确保接收者实现了所需要的操作。
 */
//形如
var Interface = function(){};
var Command = new Interface("Command", ['execute']);
//检查是否实现先了正确的操作
// Interface.exsureImplements(someCommand, Command);
// someCommand.execute();
//若使用闭包来创建命令函数，检查更简单，只需验证是否函数即可
if(typeof someCommand != "function"){
	throw new Error("Command is not function");
}

/**
 * 定义命令类
 */
//此类命令对象所起的作用只不过是把接收者的操作和调用者绑定
//十分简单，模块化程度高
var SimpleCommand = function(receving){
	this.receving = receving;
}
SimpleCommand.prototype.execute = function(){
	this.receving.action();
}
//此类命令对象实际上没有接收者，本身封装的复杂的操作实现
var ComplexComman = function(){
	this.logger = new Logger();
	this.xhrHandler = XhrManager.createXhrHandler();
	this.parameters = {};
}
ComplexComman.prototype = {
	setParameter: function(key, value){
		this.parameters[key] = value;
	},

	execute: function(){
		this.logger.log("Executing command");
		var postArray = [];
		for(var key in this.parameters){
			postArray.push(key + '=' + this.parameters[key]);
		}
		var postString = postArray.join('&');
		this.xhrHandler.request(
			"post",
			"script.php",
			function(){},
			postString
		);
	}
};
//还有一类命令对象，不但封装了接收者的操作，
//而且其execute方法中也具有一些实现代码
var GeryAreaCommand = function(receiver){
	this.logger = new Logger();
	this.receiver = receiver;
}
GeryAreaCommand.prototype.execute = function(){
	this.logger.log("Executing command");
	this.receiver.prepareAction();
	this.receiver.action();
}