/**
 * 以下几种情形是运用工厂模式十分有用：
 * 	1.对象的构建十分复杂
 * 	2.需要依赖具体环境创建不同实例
 * 	3.处理大量具有相同属性的小对象
 */

var page = page || {};
	page.dom = page.dom || {};

//子函数1：文本
page.dom.Text = function(args){
	this.insert = function(where){
		var txt = document.createTextNode(this.url = args.url || "asdf");
		where.appendChild(txt);
	}
};

//子函数2：处理连接
page.dom.Link = function(args){
	this.insert = function(where){
		var link = document.createElement("a");
		link.href = args.href || "#";
		link.appendChild(document.createTextNode(this.url = args.url || "asdf"));
		where.appendChild(link);
	}
};

//子函数3：处理图片
page.dom.Image = function(args){
	this.insert = function(where){
		var im = document.createElement("img");
		im.src = this.url = args.url || "asdf";
		where.appendChild(im);
	}
}

//工厂方法
page.dom.Factory = function(type, args){
	return new page.dom[type](args);
}