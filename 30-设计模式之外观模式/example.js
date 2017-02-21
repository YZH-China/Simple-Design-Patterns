/**
 * 外观模式
 *
 * 为子系统中的一组接口提供了一个一致的界面，
 * 定义一个高层接口，这个接口使得这一子系统更易使用。
 */

/**
 * 外观模式不见简化了类中的接口，而且对接口和调用者进行了解耦
 * 优点是，易于使用
 * 缺点是，对于需要判断功能可用性的子系统，多次使用时有性能问题。
 */

/**
 * 何时使用外观模式呢？
 * 1.设计初期，比如三层建构，数据层和业务层、业务层和表现层之间建立外观
 * 2.开发阶段，为不断重构增大的子系统建立外观，减少依赖
 * 3.维护阶段，为遗留的庞大系统建立外观类，清晰管理。
 */

/**
 * 未优化过的跨浏览器添加事件功能
 * @param {element}   el dom元素
 * @param {event}   ev 事件名字符串（不带on）
 * @param {function} fn 回调函数
 */
var addMyEvent = function(el, ev, fn){
	if(el.addEventListener){
		el.addEventListener(ev, fn, false);
	} else if(el.attachEvent){
		el.attachEvent('on' + ev, fn);
	} else {
		el['on' + ev] = fn;
	}
}
/**
 * 上面代码优化后，在初始化阶段判断一次功能可用性
 */
var addMyEvent = (function(el, ev, fn){
	if(el.addEventListener){
		return function(el, ev, fn){
			el.addEventListener(el, ev, fn);
		}  
	} else if (el.attachEvent){
		return function(el, ev, fn){
			el.attachEvent('on' + ev, fn);
		}
	} else {
		return function(el, ev, fn){
			el['on' + ev] = fn;
		}
	}
}());

/**
 * 更简单的例子，用stop接口封装了子系统接口。
 * @type {Object}
 */
var mobileEvent = {
	//...
	stop: function(e){
		e.preventDefault();
		e.stopPropagation();
	}
	//...
}