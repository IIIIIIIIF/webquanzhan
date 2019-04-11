const sql=require('mysql');
let db=sql.createPool({
	host:"localhost",
	user:"root",
	password:"",	
	database:"websocket"
});

//查询
db.query("SELECT * FROM user_table",(err,data)=>{
	if(err){
		console.log(err)
	}else{
		console.log(data)
	}
})
