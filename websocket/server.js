const http=require("http");
const io=require("socket.io");
let btext,atext

//1.创建http服务
let httpServer=http.createServer();
httpServer.listen(8088);

//2.创建socket服务
let wsServer=io.listen(httpServer);
wsServer.on("connection",function(sock){
	sock.on("a",function(text){
		console.log('接到了a客户端发送的数据：'+text);
		btext=text
	})
	sock.emit("b",btext)
	
	
	sock.on("b",function(res){
		console.log('接到了b客户端发送的数据：'+res);	
		atext=res
	})
	sock.emit("a",atext)
	/* setInterval(function(){
		sock.emit("a","哈哈哈")
	},500) */
})