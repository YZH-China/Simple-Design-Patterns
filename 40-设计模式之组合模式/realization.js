/**
 * 组合模式
 *
 * 将对象合成一个树形结构用于表示“部分-整体”的层次结构。
 * 使得对单个对象和组合对象的使用具有一致性。
 */

/**
 * 一个良好的示例是DOM机制。
 * 一个DOM节点可以包含子节点，不论这个节点是父节点还是子节点，
 * 都具有添加、删除、遍历子节点的通用功能。
 * 组合模式的关键在于一个抽象类，
 * 它既可以表示父节点，也可以表示子节点。
 */

//以菜单为例
//第一步：实现我们的菜单抽象类
var MenuComponent = function(){};
MenuComponent.prototype.getName = function(){
	throw new Error("该方法必须重写");
}
MenuComponent.prototype.getName = function(){
	throw new Error("该方法必须重写");
}
MenuComponent.prototype.getDescription = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.getPrice = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.isVegetarian = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.print = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.add = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.remove = function () {
    throw new Error("该方法必须重写!");
};
MenuComponent.prototype.getChild = function () {
    throw new Error("该方法必须重写!");
};

//第二步：创建基本的菜单项,不包含子菜单的菜单项
var MenuItem = function(sName, sDescription, bVegetarian, nPrice){
	MenuComponent.call(this);
	this.sName = sName;
	this.sDescription = sDescription;
	this.bVegetarian = bVegetarian;
	this.nPrice = nPrice;
}
MenuItem.prototype = new MenuComponent();
MenuItem.prototype.getName = function () {
    return this.sName;
};
MenuItem.prototype.getDescription = function () {
    return this.sDescription;
};
MenuItem.prototype.getPrice = function () {
    return this.nPrice;
};
MenuItem.prototype.isVegetarian = function () {
    return this.bVegetarian;
};
MenuItem.prototype.print = function () {
    console.log(this.getName() + ": " + this.getDescription() + ", " + this.getPrice() + "euros");
};

//第三步：创建带子菜单的菜单项
var Menu = function(sName, sDescription){
	MenuComponent.call(this);
	this.aMenuComponents = [];
	this.sName = sName;
	this.sDescription = sDescription;
}
Menu.prototype = new MenuComponent();
Menu.prototype.createIterator = function(){
	throw new Error("This method must be overwitten");
}
Menu.prototype.add = function(oMenuComponent){
	//添加子菜单
	this.aMenuComponents.push(oMenuComponent);
}
Menu.prototype.remove = function(oMenuComponent){
	//删除子菜单
	var aMenuItmes = [],
		nMenuItem = 0,
		nLenMenuItems = this.aMenuComponents.length,
		oItem = null;
	while( nMenuItem < nLenMenuItems){
		oItem = this.aMenuComponents[nMenuItem];
		if(oItem !== oMenuComponent){
			aMenuItmes.push(oItem);
		}
		nMenuItem += 1;
	}
	this.aMenuComponents = aMenuItmes;
};
Menu.prototype.getChild = function(nIndex){
	//获取指定子菜单
	return this.aMenuComponents[nIndex]
}
Menu.prototype.getName = function(){
	return this.sName;
}
Menu.prototype.getName = function () {
    return this.sName;
};
Menu.prototype.getDescription = function () {
    return this.sDescription;
};
Menu.prototype.print = function(){
	//打印当前菜单和所有子菜单
	console.log(this.getName() + ":" + this.getDescription());
	console.log("-------------------------------------------");
	var nMenuComponent = 0,
		nLenMenuComponent = this.aMenuComponents.length,
		oMenuComponent = null;
	while(nMenuComponent < nLenMenuComponent){
		oMenuComponent = this.aMenuComponents[nMenuComponent];
		oMenuComponent.print();
		nMenuComponent = nMenuComponent + 1;
	}
};

//第四步：创建指定的带子菜单的菜单项
var DinnerMenu = function () {
    Menu.apply(this);
};
DinnerMenu.prototype = new Menu();

var CafeMenu = function () {
    Menu.apply(this);
};
CafeMenu.prototype = new Menu();

var PancakeHouseMenu = function () {
    Menu.apply(this);
};
PancakeHouseMenu.prototype = new Menu();

//第五步：创建顶级菜单
var Mattress = function(aMenus){
	this.aMenus = aMenus;
}
Mattress.prototype.printMenu = function(){
	this.aMenus.print();
}

//第六步：调用
var oPanCakeHouseMenu = new Menu("Pancake House Menu", "Breakfast");
var oDinnerMenu = new Menu("Dinner Menu", "Lunch");
var oCoffeeMenu = new Menu("Cafe Menu", "Dinner");
var oAllMenus = new Menu("ALL MENUS", "All menus combined");

oAllMenus.add(oPanCakeHouseMenu);
oAllMenus.add(oDinnerMenu);


oDinnerMenu.add(new MenuItem("Pasta", "Spaghetti with Marinara Sauce, and a slice of sourdough bread", true, 3.89));
oDinnerMenu.add(oCoffeeMenu);

oCoffeeMenu.add(new MenuItem("Express", "Coffee from machine", false, 0.99));

var oMattress = new Mattress(oAllMenus);
console.log("---------------------------------------------");
oMattress.printMenu();
console.log("---------------------------------------------");

/**
 * 使用场景非常明确：
 * 1.想表示对象的部分-整体结构
 * 2.希望用户忽略组合对象的单个对象的不同，用户将统一的使用组件结构中所有的对象、方法。
 */