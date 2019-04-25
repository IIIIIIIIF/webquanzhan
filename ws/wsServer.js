const http=require('http');
const io=require('socket.io');
const fs=require('fs');
const sql=require('mysql');
let db=sql.createPool({
	host:"localhost",
	user:"root",
	password:"",
	database:"websocket"
});
let server=http.createServer((req,res)=>{
	fs.readFile(`www${req.url}`,(err,data)=>{
		if(err){
			res.writeHeader(404);
			res.write("没找到")
		}else{
			res.write(data);
		}
		res.end();
	})
});
server.listen(8080);
let wsServer=io.listen(server);
//记录用户数的数组
let userArr=[];
wsServer.on("connection",sock=>{
//	console.log(sock)
	userArr.push(sock)
	//保存用户状态
	let Now_user,Now_userId;
	//注册
	sock.on("reg",(user,password)=>{
		//1.检验数据
		if(!/^\w{6,32}$/.test(user)){
			sock.emit("reg_data",0,"用户名不规范")
		}else if(!/^.{6,32}$/.test(password)){
			sock.emit("reg_data",0,"密码不规范")
		}else{
			//2.查询数据
			db.query(`SELECT * FROM user_table WHERE username="${user}"`,(err,data)=>{
				if(err){
					sock.emit("reg_data",0,"数据库有错")
				}else if(data.length>0){
					sock.emit("reg_data",0,"用户名已经存在")
				}else{
					//3.插入数据
					db.query(`INSERT INTO user_table(username,password,online) VALUES("${user}","${password}",0)`,err=>{
						if(err){
							sock.emit("reg_data",0,"数据库有错")
						}else{
							sock.emit("reg_data",1,"注册成功")
						}
					})
				}
			})
		}	
	})
	//登录
	sock.on("login",(username,password)=>{
		//1.验证数据
		if(!/^\w{6,32}$/.test(username)){
			sock.emit("login_data",0,"用户名不规范")
		}else if(!/^.{6,32}$/.test(password)){
			sock.emit("login_data",0,"密码不规范")
		}else{
			//2.查询是否存在，并且校验是否与数据库一致
			db.query(`SELECT ID,password FROM user_table WHERE username="${username}"`,(err,data)=>{
				if(err){
					sock.emit("login_data",0,"数据库有错")
				}else if(data.length==0){
					sock.emit("login_data",0,"用户名不存在")
				}else{
					if(data[0].password!=password){
						sock.emit("login_data",0,"密码不正确")
					}else{
						db.query(`UPDATE user_table SET online=1 WHERE ID=${data[0].ID}`,err=>{
							if(err){
								sock.emit("login_data",0,"数据库有错")
							}else{
								sock.emit("login_data",200,"登录成功");
								Now_user=username;
								Now_userId=data[0].ID;
							}
						})
					}
				}
			})
		}
	})
//发送消息的接口
sock.on("msg",txt=>{
	//将消息广播给所有人，不包括自己
	userArr.forEach(item=>{
		if(item==sock)return false;
		
		item.emit("otheruserMsg",Now_user,txt)
	})

	//循环结束，告诉发信人发送成功
	sock.emit("msg_data",200,txt)

	}
)






//离线
		sock.on("disconnect",function(){
			db.query(`UPDATE user_table SET online=0 WHERE ID=${Now_userId}`,err=>{
				console.log("有错");
				Now_user="";
				Now_userId=0;
			})

			userArr.filter(item=>item!=sock);

		})
})