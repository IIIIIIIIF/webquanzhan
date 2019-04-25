const http=require('http');
const io=require('socket.io');
const fs=require('fs');
const sql=require('mysql');
const url=require('url');
let db=sql.createPool({
	host:"localhost",
	user:"root",
	password:"",
	database:"websocket"
});
let server=http.createServer((req,res)=>{
	//接口
	let {query,pathname}=url.parse(req.url,true);

	//注册
	if(pathname=="/reg"){		
		let {username,password}=query;
		//1.校验数据
		if(!/^\w{6,32}$/.test(username)){
			res.write(JSON.stringify({code:0,msg:"用户名不符合规范"}));
			res.end();
		}else if(!/^.{6,32}$/.test(password)){
			res.write(JSON.stringify({code:0,msg:"密码不符合规范"}));
			res.end();		
		}else{
			//2.查询数据
			db.query(`SELECT * FROM user_table WHERE username="${username}"`,(err,data)=>{
				if(err){
					res.write(JSON.stringify({code:0,msg:"数据库有错"}));
					res.end();	
				}else if(data.length>0){
					res.write(JSON.stringify({code:0,msg:"此用户名已经存在"}));
					res.end();	
				}else{
				//3.插入数据
				db.query(`INSERT INTO user_table(username,password,online) VALUES("${username}","${password}",0)`,err=>{
					if(err){
						res.write(JSON.stringify({code:0,msg:"数据库有错"}));
						res.end();
					}else{
						res.write(JSON.stringify({code:200,msg:"注册成功"}));
						res.end();
					}
				})
				}
			})		
		}
	}else if(pathname=="/login"){
		//登录接口
		let {username,password}=query;
		//1.查询用户名数据
		db.query(`SELECT ID,password FROM user_table WHERE username="${username}"`,(err,data)=>{
			if(err){
				res.write(JSON.stringify({code:0,msg:"数据库有错"}));
				res.end();	
			}else if(data.length==0){
				res.write(JSON.stringify({code:0,msg:"此用户名不存在"}));
				res.end();	
			}else if(data[0].password!=password){
				res.write(JSON.stringify({code:0,msg:"密码错误"}));
				res.end();
			}else{	
			//3.修改online为1
				db.query(`UPDATE user_table SET online=1 WHERE ID=${data[0].ID}`,err=>{
					if(err){
						res.write(JSON.stringify({code:0,msg:"数据库有错"}));
						res.end();
					}else{
						res.write(JSON.stringify({code:0,msg:"登录成功"}));
						res.end();
					}
				})
			}
		})	
	}else{
		fs.readFile("www"+pathname,(err,data)=>{
			if(err){
				res.writeHeader(404);
				res.write("NOT FOUND")
			}else{
				res.write(data)
			}
			res.end();
		})	
	}
	
});
server.listen(8080)