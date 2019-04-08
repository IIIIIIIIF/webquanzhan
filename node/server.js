const http=require('http');
const fs=require('fs');
let server=http.createServer((req,res)=>{
	//console.log(`客户端请求的路径是：${req.url}`)
	//console.log(`客户端请求的方法是：${req.method}`)
	console.log("客户端发起了请求")
	fs.readFile(`www${req.url}`,(err,data)=>{
		if(err){
			/* 404页面 */
			fs.readFile('http_errors/404.html',(err,data)=>{
				res.writeHeader(404);
				if(err){	
					res.write("No Found!")
				}else{				
					res.write(data)
				}
				res.end();
			})	
		}else{
			/* 页面存在 */
			res.write(data)	
			res.end();			
		}			
	})	
});
server.listen(8080)

