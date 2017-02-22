/**
 * 中介者模式
 *
 * 用一个中介者对象来封装一系列的对象交互。
 * 中介者使各对象不需要显示地相互引用，从而松耦合，
 * 并可以独立的改变它们之间的交互。
 */

/**
 * 如果一个对象的操作会引起其他相关对象的变化，
 * 而这个对象有不希望自己来处理这些关系，
 * 那么就可以使用中介者
 */

/**
 * 聊天室的例子
 */
//参与者对象
var Participant = function(name){
	this.name = name;
	this.chatroom = null;
}
Participant.prototype = {
	//to是接收对象，若to为null，则是群发
	send: function(message, to){
		this.chatroom.send(message, this, to);
	},

	recevie: function(message, from){
		log.add(from.name + " to " + this.name + " : " + message);
	}
};

//聊天室对象，就是中介者
//解耦了各个参与者之间的通信。
var Chatroo = function(){
	//聊天室中的成员对象
	var participants = {};

	return {
		register: function(participant){
			if(!participants[participant.name]){
				participants[participant.name] = participant;
				participant.chatroom = this;
			} else {
				return;
			}
		},

		send: function(message, from, to){
			if(to){
				to.recevie(message, from);
			} else {
				for(var key in participants){
					if(participants[key].name !== from.name){
						participants[key].recevie(message, from);
					}
				}
			}
		}
	}
};

var log = (function(){
	var log = '';

	return {
		add: function(msg){
			log += msg + '\n';
		},
		show: function(){
			alert(log);
			log = "";
		}
	}
}());

function run(){
	//定义参与者
	var yoko = new Participant('Yoko'),
		john = new Participant('John'),
		paul = new Participant('Paul'),
		ringo = new Participant('Ringo');
		chatroom = new Chatroo();
	//注册参与者
	chatroom.register(yoko);
	chatroom.register(john);
	chatroom.register(paul);
	chatroom.register(ringo);
	//通信
	yoko.send("All you need is love.");
	yoko.send("I love you John.");
	john.send("Hey, no need to broadcast", yoko);
	paul.send("Ha, I heard that!");
	ringo.send("Paul, what do you think?", paul);
	log.show();
}