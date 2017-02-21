/**
 * 取消操作和命令日志
 *
 * undo方法，可以回滚用execute执行的操作
 * undo方法可以用来实现不受限制的取消功能
 * 只需包执行过的命令对象压入栈顶即可实现对象命令执行历史的记录
 */

/**
 * 模仿Etch A Sketch游戏
 * 有四个按钮，将指针在上下左右四个方向移动10px
 * 同时又一个撤销按钮，用来撤销操作
 */

//修改command接口，添加一个undo方法
var ReversibleCommand = new Interface("ReversibleCommand", ['execute', 'undo']);

//创建四个命令，分贝项上下左右移动指针
var MoveUp = function(cursor){
	this.cursor = cursor;
}
MoveUp.prototype = {
	execute: function(){
		this.cursor.move(0, -10);
	},

	//撤销实际上是在execute之后的状态做操作
	undo: function(){
		this.cursor.move(0, 10);
	}
};

var MoveDown = function(cursor){
	this.cursor = cursor;
}
MoveDown.prototype = {
	execute: function(){
		this.cursor.move(0, 10);
	},

	undo: function(){
		this.cursor.move(0, -10);
	}
}

var MoveLeft = function(cursor){
	this.cursor = cursor;
}
MoveLeft.prototype = {
	execute: function(){
		this.cursor.move(-10, 0);
	},

	undo: function(){
		this.cursor.move(10, 0);
	}
}

var MoveRight = function(cursor){
	this.cursor = cursor;
}
MoveRight.prototype = {
	execute: function(){
		this.cursor.move(10, 0);
	},

	undo: function(){
		this.cursor.move(-10, 0);
	}
}

//接收者
//实现绘制图像的对象
var Cursor = function(width, height, parent){
	this.width = width;
	this.height = height;
	this.position = {
		x: width / 2,
		y: height / 2
	};
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	parent.appendChild(this.canvas);

	this.ctx = this.canvas.getContext('2d');
	this.ctx.fillStyle = "#CCC000";
	this.move(0, 0);
}
Cursor.prototype.move = function(x, y){
	this.position.x += x;
	this.position.y += y;
	this.ctx.clearRect(0, 0, this.width, this.height);
	this.ctx.fillRect(this.position.x, this.position.y, 3, 3);
}

//在处理调用者之前，先用装饰者模式提高命令类的模块化程度
//我们需要在某些地方加入把命令压入栈的代码
//这些代码经常重用
//所以最好事先这些代码的装饰者来包装每个命令
//这样我们就可以吧命令对象那个传递给任意的用户界面而不用担心是否实现入栈

/**
 * 装饰者
 * 在执行命令之前，将命令压入栈
 * 这是装饰者模式出色的运用
 * 由此，我们可以在保留原有接口的前提下为命令新增特性。
 */
var UndoDecorator = function(command, undoStack){
	this.command = command;
	this.undoStack = undoStack;
}
UndoDecorator.prototype = {
	execute: function(){
		this.undoStack.push(this.command);
		this.command.execute();
	},

	undo: function(){
		this.command.undo();
	}
}

/**
 * 调用者类
 * 主要作用是生成html元素，并为其绑定事件
 */
//第一类按钮，控制指针移动
var CommandButton = function(label, command, parent){
	Interface.ensureImplements(command, ReversibleCommand);
	this.element = document.createElement('button');
	this.element.innerHTML = label;
	parent.appendChild(this.element);

	addEvent(this.element, 'click', function(){
		command.execute();
	})
}
//第二类按钮，撤销操作
var UndoButton = function(label, parent, undoStack){
	this.element = document.createElement('button');
	this.element.innerHTML = label;
	parent.appendChild(this.element);

	addEvent(this.element, 'click', function(){
		if(undoStack.length === 0){
			return;
		}
		var lastCommand = undoStack.pop();
		lastCommand.undo();
	})
}

//使用
var body = document.getElementsByTagName('body')[0];
var cursor = new Cursor(400, 400, body);
var undoStack = [];
 
var upCommand = new UndoDecorator(new MoveUp(cursor), undoStack);
var downCommand = new UndoDecorator(new MoveDowm(cursor), undoStack);
var leftCommand = new UndoDecorator(new MoveLeft(cursor), undoStack);
var rightCommand = new UndoDecorator(new MoveRight(cursor), undoStack);
 
var upButton = new CommandButton('Up', upCommand, body);
var downButton = new CommandButton('Down', downCommand, body);
var leftButton = new CommandButton('Left', leftCommand, body);
var rightButton = new CommandButton('Right', rightCommand, body);
var undoButton = new UndoButton('Undo', body, undoStack);

/**
 * 使用命令日志实现不可逆的操作取消
 *
 * 可以在上面例子的机床上进行修改
 * 1.去掉所有命令类的undo方法，体现不可逆的概念。
 * 2.Cursor类中，原用来记录命令栈的undoStack现在成了该类的内部属性，改名为commandStack，其他类对它的引用全部删除。新Cursor类如下
 */
var Cursor = function(width, height, parent){
	this.width = width;
	this.height = height;
	this.commandStack = [];

	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	parent.appendChild(this.canvas);

	this.ctx = this.canvas.getContext("2d");
	this.ctx.fillStyle = "#CCC000";
	this.move(0, 0);
}
Cursor.prototype = {
	move: function(x, y){
		var _this = this;
		this.commandStack.push(function(){
			_this.lineTo(x, y);
		})
	},

	//实际划线的方法
	lineTo: function(x, y){
		this.position.x += x;
		this.position.y += y;
		this.ctx.lineTo(this.position.x, this.position.y);
	},

	//负责充值canvas
	executeCommands: function(){
		this.position = {x: this.width / 2, y: this.height / 2};
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.beginPath();
		this.ctx.moveTo(this.position.x, this.position.y);
		for(var i = 0; i < this.commandStack.length; i += 1){
			this.commandStack[i]();
		}
		this.ctx.stroke();
	},

	//删除最近的命令，然后重置状态
	undo: function(){
		this.commandStack.pop();
		this.executeCommands();
	}
}
/**
 * 3.对undoStack的引用都删除了，于是要修改事件绑定
 */
var undoBUtton = function(label, parent, cursor){
	this.element = document.createElement("button");
	this.element.innerHTML = label;
	parent.appendChild(this.element);

	addEvent(this.element, 'click', function(){
		cursor.undo();
	})
}
/**
 * 4.使用方法也变化了
 */
var body = document.getElementsByTagName('body')[0];
var cursor = new Cursor(400, 400, body);
 
var upCommand = new Moveup(cursor);
var downCommand = new MoveDown(cursor);
var leftCommand = new MoveLeft(cursor);
var rightCommand = new MoveRight(cursor);
 
var upButton = new CommandButton('Up', upCommand, body);
var downButton = new CommandButton('Down', downCommand, body);
var leftButton = new CommandButton('Left', leftCommand, body);
var rightButton = new CommandButton('Right', rightCommand, body);
var undoButton = new UndoButton('Undo', body, undoStack);