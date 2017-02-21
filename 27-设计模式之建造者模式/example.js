/**
 * 建造者模式
 * 
 * 在软件系统中，我们常常需要构建一个“复杂的对象”
 * 这个对象通常有各个子对象通过算法构成，
 * 当子对象需求剧烈变化时，构造算法却依然稳定。
 *
 * 建造模式可以将复杂对象的构建和表示相分离，
 * 使得同样的构建过程可以创建不同的表示。
 *
 * 用户只需确认要构建哪一类对象，而可以忽略细节过程。
 *
 * 可以说建造者模式就是对用户屏蔽细节。
 */

//典型实例就是回调函数
//数据获取跟我无关，我只需拿到数据，用回调处理就好。
function getBeerById(id, callback){
	//使用id请求数据
	asyncRequest("get", 'beer.uri?id=' + id, function(resp){
		//这里对我们屏蔽了数据获取
		callback(resp.responseText);
	})
}

var el = document.getElementById("test");
el.addEventListener('click', getBeerByIdBridge, false);

function getBeerByIdBridge(e){
	//e是事件对象
	//此上下文中存在一个this对象，指向主调对象el
	getBeerById(this.id, function(beer){
		console.log("Requested Beer" + beer);
	})
}