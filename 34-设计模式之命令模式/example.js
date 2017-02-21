/**
 * 给出接收者的操作
 * FileActions 
 	    -open()
	    -close()
	    -save()
	    -saveAS()
	    
	EditActions
	    -cut()
	    -copy()
	    -parste()
	    -delete()
	 
	InsertACtions
	    -textBlock()
	    
	HelpActions
	    -showHelp   
	本例实现一个桌面应用程序风格的菜单栏的类
	通过命令对象，让这些菜单这行各种操作
 */

/**
 * 接口验证在本例尤为重要
 * 因为我们要用组合模式处理菜单，而组合模式依赖于接口
 */
var Command = new Interface("Command", ['execute']);
var Composite = new Interface("Composite", ['add','remove','getChild','getElement']);
var MenuObject = new Interface("MenuObject", ['show']);

/**
 * 菜单组合对象
 * MenuBar和Menu是组合类对象，MenuItem是叶类
 * MenuBar类保存着所有Menu实例
 */
var MenuBar = function(){
	this.menus = {};
	this.element = document.createElement("ul");
	this.element.style.dispaly = 'none';
}
MenuBar.prototype = {
	add: function(menuObject){
		Interface.ensureImplements(menuObject, Composite, MenuObject);
		this.menus[menuObject.name] = menuObject;
		this.element.appendChild(this.menus[menuObject.name].getElement);
	},

	remove: function(name){
		delete this.menus[name];
	},

	getChild: function(name){
		return this.menus[name];
	},

	getElement: function(){
		return this.element;
	},

	show: function(){
		this.element.style.dispaly = 'block';
		for(var name in this.menus){
			this.menus[name].show();
		}
	}
};
/**
 * Menu类于MenuBar类似，不过管理的是MenuItem实例
 */
var Menu = function(name){
	this.name = name;
	this.items = {};
	this.element = document.createElement("li");
	this.element.innerHtml = this.name;
	this.element.style.dispaly = "none";
	this.container = document.createElement("ul");
	this.element.appendChild(this.container);
}
Menu.prototype = {
	add: function(menuitemObject){
		Interface.ensureImplements(menuitemObject, Composite, MenuObject);
		this.items[menuitemObject.name] = menuitemObject;
		this.container.appendChild(this.items[menuitemObject.name].getElement());
	},

	remove: function(name){
		delete this.items[name];
	},

	getChild: function(name){
		return this.items[name];
	},

	getElement: function(){
		return this.element;
	},

	show: function(){
		this.element.style.dispaly = 'block';
		for(var name in this.items){
			this.items[name].show();
		}
	}
};
/**
 * MenuItem类才是真正的调用者类
 * 点击MenuItem实例，会调用与其绑定在一起的命令对象。
 * 为此，要先确保传入构造函数的命令对象实现了execute方法。
 * 然后再注册click事件
 */
var MenuItem = function(name, command){
	//确保command有Command中配置的方法
	Interface.ensureImplements(command, Command);
	this.name = name;
	this.element = document.createElement("li");
	this.element.style.dispaly = "none";
	this.auchor = document.createElement("a");
	this.auchor.href = "#";
	this.element.appendChild(this.auchor);
	this.auchor.innerHTML = this.name;

	//添加事件
	addEvent(this.auchor, 'click', function(e){
		e.preventDefault();
		command.execute();
	})
}
MenuItem.prototype = {
	add: function(){},
	remove: function(){},
	getChild: function(){},
	getElement: function(){
		return this.element;
	},

	show: function(){
		this.element.style.dispaly = 'block';
	}
};
//每个MenuItem都与一个命令对象绑在一起
//这个命令对象不能改变，若想改变只能创建一个新的MenuItem对象

/**
 * 命令类
 *
 * MenuCommand这个命令类非常简单。
 * 其构造函数的参数，就是将被作为操作而调用的方法。
 */
var MenuCommand = function(action){
	this.action = action;
}
MenuCommand.prototype.execute = function(){
	this.action();
}
//如果action内部用到了this关键字，
//那么这个action应该保存在一个匿名函数中
/*var someCommand = new MenuCommand(function(){
	myObject.someMethod();
})*/

//使用
var FileActions = new FileActions(),
	EditActions = new EditActions(),
	InsertActions = new InsertActions(),
	HelpActions = new HelpActions(),
	//创建MenuBar实例
	appMenuBar = new MenuBar(),
	//创建文件菜单
	fileMenu = new Menu('File'),
	openCommand = new MenuCommand(FileActions.open),
	closeCommand = new MenuCommand(FileActions.close),
	saveCOmmand = new MenuCommand(FileActions.save),
	saveAsCommand = new MenuCommand(FileActions.saveAs),
	//创建编辑菜单
	editMenu = new Menu('Edit'),
 	cutCommand = new MenuCommand(EditActions.cut),
 	copyCommand = new MenuCommand(EditActions.copy),
 	pasteCommand = new MenuCommand(EditActions.paste),
 	deleteCommand = new MenuCommand(EditActions.delete),
 	//创建插入菜单
 	insertMenu = new Menu('Insert'),
 	textBlockCommand = new MenuCommand(InsertACtions.textBlock),
 	//创建帮助菜单
	helpMenu = new Menu('Help'),
	showHelpCommand = new MenuCommand(HelpActions.showHelp());

fileMenu.add(new MenuItem('open', openCommand));
fileMenu.add(new MenuItem('Close', closeCommand));
fileMenu.add(new MenuItem('Save', saveCommand));
fileMenu.add(new MenuItem('Close', saveAsCommand));
appMenuBar.add(fileMenu);

editMenu.add(new MenuItem('Cut', cutCommand));
editMenu.add(new MenuItem('Copy', copyCommand));
editMenu.add(new MenuItem('Paste', pasteCommand));
editMenu.add(new MenuItem('Delete', deleteCommand));
appMenuBar.add(editMenu);

insertMenu.add(new MenuItem('Text  Block', textBlockCommand));
appMenuBar.add(insertMenu);

helpMenu.add(new MenuItem('Show Help', showHelpCommand));
appMenuBar.add(helpMenu);

document.getElementsByTagName('body')[0].appendChild(appMenuBar.getElement());
appMenuBar.show();