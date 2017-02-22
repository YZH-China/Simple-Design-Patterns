/**
 * 迭代器模式（Iterator）
 *
 * 提供一种方法顺序遍历一个聚合对象中的各个元素，
 * 而又不暴露该对象内部表示。
 */

/**
 * 几个特点：
 * 1.访问一个聚合对象的内容而无需暴露它的内部表示
 * 2.为遍历不同集合提供一个统一的接口，从而支持同样的算法在不同的集合上进行操作
 * 3.遍历的同时更改迭代器所在的集合结构可能会导致问题
 */

var agg = (function () {
	var index = 0,
		data = [1, 2, 3, 4, 5],
		length = data.length;

	return {
		next: function(){
			var element;
			if(!this.hasNext()){
				return null;
			}
			element = data[index];
			index += 1;
			return element;
		},

		hasNext: function(){
			return index < length;
		},

		rewind: function(){
			index = 0;
		},

		current: function(){
			return data[index];
		}
	}
});

/**
 * 事实上，在js中我们很少会使用自制的迭代器。
 * 一般迭代器可以用来处理数组和对象。
 * 在js中
 * 推荐使用for循环遍历数组对象，
 * 使用for--in循环遍历普通对象，配合hasOwnProperty函数处理每一项属性。
 */