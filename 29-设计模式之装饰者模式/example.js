/**
 * 本例较为复杂，且暂时想不到能用到哪里。
 * 但对于理解装饰者有帮助。
 */

var tree = {};
tree.decorate = function(){
	console.log('Make sure the tree won\'t fall');
}

tree.getDecortaor = function(deco){
	//每次挑用，会将相应装饰类的原型指定到主调对象上。
	//从而保持getDecortaor函数可用。
	tree[deco].prototype = this;
	return new tree[deco];
}

//装饰类
tree.RedBalls = function(){
	this.decorate = function(){
		this.RedBalls.prototype.decorate();
		console.log('Put on some red balls');
	}
}
tree.BlueBalls = function(){
	this.decorate = function(){
		this.BlueBalls.prototype.decorate();
		console.log('Add blue balls');
	}
}
tree.Angel = function(){
	this.decorate = function(){
		this.Angel.prototype.decorate();
		console.log('An angel on the top');
	}
}

//每次赋值会导致tree变化类型，但getDecortaor函数始终存在。
tree = tree.getDecorator('BlueBalls'); 
tree = tree.getDecorator('Angel'); 
tree = tree.getDecorator('RedBalls');

tree.decorate();