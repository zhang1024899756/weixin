var Koa = require('koa');

var Generator = require('./chat/generator');
var Config = require('./config/config');
var Weixin = require('./chat/weixin');


var app = new Koa();

app.use(Generator(Config.wechat,Weixin.reply));

app.listen(3001);
console.log('Runing and listening in 3001 port......');
