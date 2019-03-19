const http=require("http");
const io=require("socket.io");


//1.创建http服务
let httpServer=http.createServer();
httpServer.listen(8088);

//2.创建socket服务
let wsServer=io.listen(httpServer);
wsServer.on("connection",function(sock){
	sock.on("a",function(num1,num2,num3){
		console.log('接到了客户端发送的数据：'+num1+num2+num3);	
	})	
	setInterval(function(){
		sock.emit("a","哈哈哈")
	},500)
})