var express = require('express');
var router = express.Router();
//获取数据
var data = require('../public/data.json')
//登录页面
router.get('/',function(req,res,next){
  res.render('login',{title:'Express'});
});
//登录用户验证
router.post('/list',function(req,res,next){
  var username = req.body.username;
  var pwd = req.body.password;
  if(username == data.users[0].username && pwd == data.users[0].password){
    res.render('list',{data});
  }
  else{
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF8'});
    res.end('用户名密码错误');
  }
})

module.exports = router;