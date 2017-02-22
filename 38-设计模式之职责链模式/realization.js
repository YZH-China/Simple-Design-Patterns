/**
 * 职责链模式
 *
 * 是使多个对象都有机会处理请求，
 * 从而避免请求的发送者和接受者之间的耦合。
 * 将多个处理对象连成一条链，沿着这条链传递请求，
 * 直到有一个对象处理为止。
 */

/**
 * 从第一个对象开始，链中收到请求的对象要么亲自处理，要么给下一个候选者。
 * 提交请求的对象，并不知道那个对象会处理它，
 * 也就是说，该对象有一个隐式的接受者。
 * 在运行时确定候选者。
 */

//责任链对象
function Handler(s, t){
	//s：继任者对象，也是handler对象
	//t：传递层级
	this.successor = s;
	this.topic = t;
}
Handler.prototype = {
	handle: function(){
		this.successor.handle();
	}
}

//首先定义责任链底层对象
var app = new Handler({
	handle: function(){
		console.log("this is app.prototype.handle");
	}
}, 3);
//第二个处理对象
var dialog = new Handler(app, 1);
//若只想要dialog的handle执行，只需如下：
// dialog.handle = function(){
// 	console.log("this is dialog.handle");
// }
//若想要每个对象都处理，则需如下：
dialog.handle = function(){
	//处理操作之前则先调用继任者的handle
	//Handler.prototype.handle.call(this);
	console.log("dialog before...");
	
	//处理操作
	console.log("this is dialog.handle");

	console.log("dialog after...");
	//处理操作之后则后调用继任者的handle
	Handler.prototype.handle.call(this);
}
//第三个处理对象
var button = new Handler(dialog, 2);
button.handle = function(){
	console.log("this is button.handle");
	Handler.prototype.handle.call(this);
}

//越后定义的处理对象越高层
//事实上，通过控制Handler.prototype.handler.call(this)
//的位置，可以实现从低到高和从高到低执行。
//还可以传入参数，用来处理参数
button.handle();

/**
 * 责任链模式常常和组合模式一起使用，
 * 这样一个构件的父构件可以作为其继任者。
 */