const http =require('http');


let allowHost=[];

let server=http.createServer((req,res)=>{
            if(allowHost.indexOf(req.headers['origin'])!=-1){
                res.setHeader("access-control-allow-origin","*")
            }
            res.write("链接成功")
            res.end;
})

server.listen(8080)