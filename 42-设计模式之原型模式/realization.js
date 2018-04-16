/**
 * 原型模式
 *
 * javascript中使用object.create()方法创建原型模式
 * 原型模式是指利用原型实例创建对象的种类，
 * 并通过拷贝这些原型创建新对象
 */

//ECMAScripte5中给出了使用Object.create()方式拷贝对象的方法

function inherit(p){
	//这里的参数p就是新对象的原型对象。
	if(!p){
		throw TypeError();
	}
	if(!Object.create){
		return Object.create(p);
	}
	var t = typeof p;
	if(t !== 'object' && t !== 'function'){
		throw TypeError();
	}
	function f(){};
	f.prototype = p;
	return new f();
}

//一个小的例子
var vehiclePrototype = {
	init: function(carModel){
		this.model = carModel;
	},

	getModel: function(){
		console.log("车辆模具是：" + this.model);
	}
}

var car = inherit(vehiclePrototype);
car.init("福特Escort");
car.getModel();