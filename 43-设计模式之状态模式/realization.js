/**
 * 状态模式
 *
 * 允许一个对象在其内部状态改变的时候改变它的行为，
 * 对象看起来似乎修改了它的类。
 */

/**
 * 一个典型示例就是下载状态管理
 * 通常就会有好几个状态：
 * 准备状态（ReadyState）
 * 下载状态（DownloadingState）
 * 暂停状态（DownloadPausedState）
 * 下载完毕状态（DownloadedState）
 * 失败状态（DownloadFailedState）
 * 每个状态下只能当前状态下能做的事情。
 * 关键在于一个State抽象类，它描述了每种状态下不同的行为
 */
 
 //State函数（类）
 var State = function(){};
 State.prototype.download = function(){ //正在下载
 	throw new Error("该方法必须被重写")
 }
 State.prototype.pause = function(){ //暂停
 	throw new Error("该方法必须被重写")
 }
 State.prototype.fail = function(){ //下载失败
 	throw new Error("该方法必须被重写")
 }
 State.prototype.finish = function(){ //下载完成
 	throw new Error("该方法必须被重写")
 }

 //ReadyState函数(子类)，用于将状态传递给一个download状态
 //该函数接收了一个Download维护函数的实例作为参数，
 //Download函数用于控制状态的改变和获取（类似于中央控制器，让外部调用），
 //ReadyState重写了原型的download方法，以便开始进行下载。
 var ReadyState = function(oDownload){
 	State.call(this);
 	this.oDownload = oDownload;
 }
 ReadyState.prototype = new State();
 ReadyState.prototype.download = function(){
 	this.oDownload.setState(this.oDownload.getDownloadingState());
 	//Ready以后，可以开始下载，所以设置了Download函数里的状态获取方法。
 	console.log("开始下载");
 }
 ReadyState.prototype.pause = function(){
 	throw new Error("还没开始下载，不能暂停！");
 }
 ReadyState.prototype.fail = function(){
 	throw new Error("文件还没开始下载，怎么能说失败呢？");
 }
 ReadyState.prototype.finish = function(){
 	throw new Error("文件还没开始下载，怎么能结束呢？");
 }

 //Download类
 var Download = function(){
 	this.oState = new ReadyState(this);
 }
 Download.prototype.setSate = function(oState){
 	this.oState = oState;
 }
 // 对外暴露的四个公共方法，以便外部调用
Download.prototype.download = function () {
    this.oState.download();
};
Download.prototype.pause = function () {
    this.oState.pause();
};
Download.prototype.fail = function () {
    this.oState.fail();
};
Download.prototype.finish = function () {
    this.oState.finish();
};
//获取各种状态，传入当前this对象
Download.prototype.getReadyState = function () {
    return new ReadyState(this);
};
Download.prototype.getDownloadingState = function () {
    return new DownloadingState(this);
};
Download.prototype.getDownloadPausedState = function () {
    return new DownloadPausedState(this);
};
Download.prototype.getDownloadedState = function () {
    return new DownloadedState(this);
};
Download.prototype.getDownloadedFailedState = function () {
    return new DownloadFailedState(this);
};

/**
 * 之后是四个具体的下载状态类定义
 */
var DownloadingState = function (oDownload) {
    State.apply(this);
    this.oDownload = oDownload;
};
DownloadingState.prototype = new State();
DownloadingState.prototype.download = function () {
    throw new Error("文件已经正在下载中了!");
};
DownloadingState.prototype.pause = function () { 
	this.oDownload.setState(this.oDownload.getDownloadPausedState());
    console.log("暂停下载!");
};
DownloadingState.prototype.fail = function () { 
	this.oDownload.setState(this.oDownload.getDownloadedFailedState());
    console.log("下载失败!");
};
DownloadingState.prototype.finish = function () {
    this.oDownload.setState(this.oDownload.getDownloadedState());
    console.log("下载完毕!");
};
/*--========================--*/
var DownloadPausedState = function (oDownload) {
    State.apply(this);
    this.oDownload = oDownload;
};
DownloadPausedState.prototype = new State();
DownloadPausedState.prototype.download = function () {
    this.oDownload.setState(this.oDownload.getDownloadingState());
    console.log("继续下载!");
};
DownloadPausedState.prototype.pause = function () {
    throw new Error("已经暂停了，咋还要暂停呢!");
};
DownloadPausedState.prototype.fail = function () { 
	this.oDownload.setState(this.oDownload.getDownloadedFailedState());
    console.log("下载失败!");
};
DownloadPausedState.prototype.finish = function () {
    this.oDownload.setState(this.oDownload.getDownloadedState());
    console.log("下载完毕!");
};
/*--========================--*/
var DownloadedState = function (oDownload) {
    State.apply(this);
    this.oDownload = oDownload;
};
DownloadedState.prototype = new State();
DownloadedState.prototype.download = function () {
    this.oDownload.setState(this.oDownload.getDownloadingState());
    console.log("重新下载!");
};
DownloadedState.prototype.pause = function () {
    throw new Error("对下载完了，还暂停啥？");
};
DownloadedState.prototype.fail = function () {
    throw new Error("都下载成功了，咋会失败呢？");
};
DownloadedState.prototype.finish = function () {
    throw new Error("下载成功了，不能再为成功了吧!");
};
/*--========================--*/
var DownloadFailedState = function (oDownload) {
    State.apply(this);
    this.oDownload = oDownload;
}
DownloadFailedState.prototype = new State()
DownloadFailedState.prototype.download = function () {
    this.oDownload.setState(this.oDownload.getDownloadingState());
    console.log("尝试重新下载!");
}
DownloadFailedState.prototype.pause = function () {
    throw new Error("失败的下载，也不能暂停!");
}
DownloadFailedState.prototype.fail = function () {
    throw new Error("都失败了，咋还失败呢!");
}
DownloadFailedState.prototype.finish = function () {
    throw new Error("失败的下载，肯定也不会成功!");
}

//调用
var oDownload = new Download();
$("#download_button").on('click', function(){
	oDownload.download();
})
$("#pause_button").click(function () {
    oDownload.pause();
});
$("#resume_button").click(function () {
    oDownload.download();
});

/**
 * 状态模式的适用场景:
 * 1.一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为。
 * 2.一个操作中含有大量的分之语句，这些分支语句依赖于该对象的状态。通常为一个或多个枚举常量的表示。
 */