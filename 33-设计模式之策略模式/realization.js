/**
 * 策略模式：
 *
 * 策略模式定义了算法家族，分别封装起来，
 * 让他们之间可以相互替换，
 * 此模式让算法的变化不会影响到使用算法的客户
 */

//一个数据合法性验证的例子。
//但当我们想增加需求，还要来修改这段代码以增加逻辑
//单元测试也越来越复杂
/*var validator = {
	validate: function(value, type){
		switch (type){
			case 'isNoEmpty':
				return true; //noempty验证结果
			case 'isNumber':
				return true; //number验证结果
			case 'isAlphaNum':
				return true; //alphanum验证结果
			default:
				return true;
		}
	}
}
//测试
console.log(validator.validate("123", "isNoEmpty"));*/

//如何避免上述代码的问题呢？
//根据策略模式
//将相同工作的代码单独封装成不同的类
//然后通过统一的策略处理类来处理

/**
 * 策略处理类
 */
var validator = {
	//所有可以的验证规则处理类存放的地方，后面会单独定义
	types: {},

	//验证类型所对应的错误信息
	messages: [],

	//当然需要使用的验证类型
	config: {},

	//暴露的公开验证方法
	//传入的参数是key => value对
	validate: function(data){
		var i, msg, type, checker, result_ok;

		//清空所有的错误信息
		this.messages = [];

		for(i in data){
			type = this.config[i]; //根据key查询是否有存在的验证规则
			checker = this.types[type]; //获取验证规则的验证类

			if(!type){
				continue; //如果验证规则不存在，则不处理
			}
			if(!checker){
				throw{
					name: "ValidationError",
					message: "No handler to validate type" + type
				}
			}

			result_ok = checker.validate(data[i]); //使用查到的单个验证类进行验证
			if(!result_ok){
				msg = "Invalid value for *" + i + "*," + checker.instructions;
				this.messages.push(msg);
			}
		}

		return this.hasErrors();
	},

	//helper
	hasErrors: function(){
		return this.messages.length !== 0;
	}
};

//之后，来定义types里存放的各种验证类
//验证给定的值是否不为空
validator.types.inNoEmpty = {
	validate: function(value){
		return value !== '';
	},
	instructions: "传入的值不能为空！"
};
//验证给定的值是否是数字
validator.types.isNumber = {
	validate: function(value){
		return !isNaN(value);
	},
	instructions: "传入的值只能是合法的数字，例如：1,3.14或者2010"
};
//验证给定的值是否只是字母或数字
validator.types.isAlphaNum = {
	validate: function(value){
		return !/^a-z0-9/i.test(value);
	},
	instructions: "传入的值只能是字母或数组，不能包含特殊字符"
};

//使用时，要注意验证的数据集合以及每种数据需要验证的规则类型
var data = {
	first_name: "Tom",
	last_name: "Xu",
	age: "23",
	username: "TomXu"
};

validator.config = {
	first_name: 'inNoEmpty',
	age: "isNumber",
	username: 'isAlphaNum'
};

//最后，获取验证结果
validator.validate(data);

if(validator.hasErrors()){
	console.log(validator.messages.join('\n'));
}