/**
 * 桥接模式
 *
 * 将抽象部分与它的实现部分分离，
 * 使它们都可以独立的变化。
 */

/**
 * 桥接模式最常用在事件监控上
 */
//代码示例
addEvent(element, 'click', getBeerById);
function getBeerById(){
	var id = this.id;
	asyncRequest("Get", 'beer.uri?id=' + id, function(resp){
		console.log('Requested Beer:' + resp.responseText);
	})
}
// ==========>>使用桥接后：
addEvent(element, 'click', getBeerByIdBridge);
function getBeerByIdBridge(e){ //该函数就是一个桥
	getBeerById(this.id, function(beer){
		console.log('Requested Beer:' + beer);
	})
}
function getBeerById(id, callback){
	//通过ID发送请求，然后返回数据
	asyncRequest("GET", 'beer.uri?id=' + id, function(resp){
		callback(resp.responseText);
	})
}