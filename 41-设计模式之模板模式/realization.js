/**
 * 模板模式
 *
 * 定义了一个操作中的算法的骨架，而将一些步骤延迟到子类中。
 * 模板方法使得子类可以不改变一个算法的结构，
 * 即可重定义该算法的某些特定步骤。
 *
 * 是一种代码复用的基本技术。
 * 在库中尤为重要，因为它提取了类库总的公共行为。
 * 导致一种反向的控制结构，
 * 即“别找我们，我们找你”，指父类调用子类操作。
 * 具体体现在面向对象编程，就是抽象类及其子类。
 */

/**
 * 实现一个让用户自主选择是否添加小料的冲泡饮料的功能
 */
//首先定义抽象
var CaffeineBeverage = function(){};
CaffeineBeverage.prototype.prepareRecepe = function(){
	this.boilWater();
	this.brew();
	this.pourOnCup();
	if(this.customerWantsCondiments()){
		this.addCondiments();
	}
};
CaffeineBeverage.prototype.boilWater = function(){
	consle.log("将水烧开");
}
CaffeineBeverage.prototype.brew = function(){
	console.log("将饮料导入杯子里")
}
CaffeineBeverage.prototype.brew = function(){
	throw new Error("该方法必须重写")
}
CaffeineBeverage.prototype.addCondiments = function(){
	throw new Error("该方法必须重写")
}
//默认是要添加小料的
CaffeineBeverage.prototype.customerWantsCondiments = function(){
	return true;
}

//具体饮料的特性在子类中实现
var Coffee = function(){
	CaffeineBeverage.call(this);
}
Coffee.prototype = new CaffeineBeverage();
Coffee.prototype.brew = function(){
	console.log("冲咖啡");
}
Coffee.prototype.addCondiments = function(){
	console.log("添加牛奶和糖")
}
Coffee.prototype.customerWantsCondiments = function(){
	return confirm("是否加糖和牛奶？");
}

var Tea = function(){
	CaffeineBeverage.call(this);
}
Tea.prototype = new CaffeineBeverage();
Coffee.prototype.brew = function(){
	console.log("泡茶");
}
Coffee.prototype.addCondiments = function(){
	console.log("添加柠檬")
}
Coffee.prototype.customerWantsCondiments = function(){
	return confirm("是否加柠檬？");
}

/**
 * 适用情况
 * 1.一次性实现一个算法不变的部分，并将可变的行为留给子类
 * 2.提取各子类重复的代码到父类中，利用一个模板方法来调用这些代码。
 * 3.控制子类扩展，模板方法只在特定点调用hook操作，这样就允许这些点进行扩展。
 */