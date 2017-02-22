/**
 * 享元模式
 *
 * 运行共享技术，有效地支持大量细粒度的对象，
 * 避免大量拥有相同内容的小类的开销，使大家共享一个类（元类）
 * 如果发现大量实例对象除了个别参数外的开销一致，
 * 将参数移动到类实例的外边，在方法调用时再给入，
 * 可以大幅幅度减少单个实例的数目
 */

/**
 * javascript中享元模式可以用在
 * 1.内存中大量相似对象
 * 2.用于dom层，避免为父元素下的每个子元素都添加事件。
 */

/**
 * 示例一
 * 书籍管理：book = {ID, Title, Author, Genre, Page count, Publisher ID, ISBN}
 * status: = {checkoutDate, checkoutMember, dueReturnDate, availability}
 * 按一般形式，当book对象存在成百上千个的时候，会占用大量内存。
 * 通过享元模式改进，能大量节省内存
 */
//通过两个单例对象，和内外部属性管理机制，实现享元
//book对象
var Book = function(title, author, genre, pageCount, publisherID, ISBN){
	this.title = title;
	this.author = author;
	this.genre = genre;
	this.pageCount = pageCount;
	this.publisherID = publisherID;
	this.ISBN = ISBN;
}

/* Book工厂 单例*/
var BookFanctory = (function(){
	var existingBooks = {};
	return {
		createBook: function(title, author, genre,pageCount,publisherID,ISBN){
			/* 查找之前是否创建 */
			var existingBook = existingBooks[ISBN];
			if(existingBook){
				return existingBook;
			} else {
				var book = new Book(title, author, genre,pageCount,publisherID,ISBN);
				existingBooks[ISBN] = book;
				return book;
			}
		}
	}
}());

/* 外部状态管理 单例 */
var BookRecordManager = (function(){
	var bookRecordDatabase = {};
	/* 添加借书记录 */
	addBookRecord: function(id, title, author, genre,pageCount,publisherID,ISBN, checkoutDate, checkoutMember, dueReturnDate, availability){
		var book = BookFanctory.createBook(title, author, genre,pageCount,publisherID,ISBN);
		bookRecordDatabase[id] = {
			checkoutMember: checkoutMember,
			checkoutDate: checkoutDate,
			dueReturnDate: dueReturnDate,
			availability: availability,
			book: book
		};
	},

	updateCheckoutStatus: function(bookId, newStatus, checkoutDate, checkoutMember, newRetrunDate){
		var record = bookRecordDatabase[bookId];
		record.availability = newStatus;
		record.checkoutDate = checkoutDate;
		record.checkoutMember = checkoutMember;
		record.dueReturnDate = newRetrunDate;
	},

	extendCheckoutPeriod: function(bookID, newReturnDate){
		bookRecordDatabase[bookID].dueReturnDate = newRetrunDate;
	},

	isPastDue: function(bookId){
		var currentDate = new Date();
		return currentDate.getTime() > Date.parse(bookRecordDatabase[bookId].dueReturnDate);
	}
}())

/**
 * 享元模式的另一个应用是DOM中，实现事件委托。这里不再赘述
 */