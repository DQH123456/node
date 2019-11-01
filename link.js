const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const queryString = require('querystring');
const chapterList = require('./word');
//const userList = require('./Data');

http.createServer((req,res)=>{
    var userList = [
        {username: "111", pwd: "111"}
    ];
    var urlObj = url.parse(req.url);
    var pathName = urlObj.pathname;
    if(pathName == '/list'){
        showList(res);
    }
    else if(pathName == '/login'){
        showLogin(res);
    }
    else if(pathName == '/getlogin'){
        var userData="";
        req.on("data",function(chunk){
            userData+=chunk;
        });
        req.on("end",function(){
            var user = queryString.parse(userData);
            var username = user.username;
            var password = user.password;
            var data = false;
            for(var i = 0;i<userList.length;i++){
                console.log(userList[i]);
                if(userList[i].username==username&&userList[i].pwd==password){
                    data = true;
                    res.writeHead(200,{"Content-type":"application/json"});
                    res.end(JSON.stringify(data));
                    break;
                }
            }
                if(data == false){
                    res.writeHead(200,{"Content-Type":"application/json"});
                    res.end(JSON.stringify(data));

                }
        })
    }
    else if(pathName =='/listmanager'){
        showManager(res);
    }
    else if(pathName == '/addChapter'){
        showAdd(res);
    }  
    //展示详情
    else if(pathName == '/detail'){
        showDetail(res);
    }
    //获取博客内容列表
    else if(pathName == '/getChapterList'){
        // res.writeHead(200, {'Content-Type': 'text/html'});
        var str = JSON.stringify(chapterList);
        res.end(str);
    }
    //获得详情页
    else if(pathName == '/getDetail'){
        var chapterId = queryString.parse(urlObj.query).chapterId;
        var dataList = [];
        chapterList.forEach((data,index) => {
            if(data.chapterId == chapterId){
                dataList.push(data);
            }
        })
        res.writeHead(200,{'Content-Type':'application/json'});
        var str = JSON.stringify(dataList);
        res.end(str);
    }
    else if(pathName == '/add'){
        var Data = '';
        req.on("data",(chunk) =>{
            Data += chunk;
        });
        req.on('end',() =>{
            var art = queryString.parse(Data);
            var New = {
                chapterId:chapterList[chapterList.length - 1].chapterId + 1,
                chapterName:art.title,
            }
            console.log(New);
            chapterList.push(New);
            data = {code:0};
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify(data));
        });
    }
    else{
        var htmlPath = path.join(__dirname,pathName);
        if(pathName.indexOf('js') >= 0){
            var htmlContent = fs.readFileSync(htmlPath);
            res.writeHead(200,{"Content-Type":"text/javascript"});
            res.end(htmlContent);
        }
        else if(pathName.indexOf('css') >= 0){
            var htmlContent = fs.readFileSync(htmlPath);
            res.writeHead(200,{"Content-Type":"text/css"});
            res.end(htmlContent);
        }
        else if(pathName.indexOf('png') >= 0){
            var htmlContent = fs.readFileSync(htmlPath);
            res.writeHead(200,{"Content-Type":"image/png"});
            res.end(htmlContent);
        }
        else if(pathName.indexOf('jpg')>=0 || pathName.indexOf('jpeg')>=0){
            var htmlContent = fs.readFileSync(htmlPath);
            res.writeHead(200,{"Content-Type":"image/jpg"});
            res.end(htmlContent);
        }else{
            res.writeHead(200,{"Content-Type":"text/plain"})
        }
    }
}).listen(8083);

function showList(res){
    var listPath = path.join(__dirname,"/chapterList.html");
    var listContent = fs.readFileSync(listPath);
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    res.end(listContent); 
}
function showLogin(res){
    var loginPath = path.join(__dirname,"/login.html");
    var loginContent = fs.readFileSync(loginPath);
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    res.end(loginContent);
}
function showManager(res){
    var managerPath = path.join(__dirname,"/list.html");
    var managerContent = fs.readFileSync(managerPath);
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    res.end(managerContent);
}
function showAdd(res){
    var addPath = path.join(__dirname,"/addChapter.html");
    var addContent = fs.readFileSync(addPath);
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    res.end(addContent);
}
function showDetail(res){
    var detailPath = path.join(__dirname,"/chapter.html");
    var detailContent = fs.readFileSync(detailPath);
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    res.end(detailContent);
}
