var Sha1 = require('sha1');
var getRowBody = require('raw-body');

var WeChat = require('./wechat');
var Tool = require('./tool');


module.exports = function (options,handler) {

  var weChat = new WeChat(options);

  return function *(next) {
    console.log(this.query);

    var token = options.token;
    var signature = this.query.signature;
    var nonce = this.query.nonce;
    var timestamp = this.query.timestamp;
    var echostr = this.query.echostr;
    var that = this;

    var str = [token,timestamp,nonce].sort().join('');
    var sha = Sha1(str);

    if (this.method === 'GET') {
      if (sha === signature) {
        this.body = echostr + ''
      }else {
        this.body = 'wrong'
      }
    }else if (this.method === 'POST') {

      if (sha !== signature) {
        this.body = 'wrong'
        return false;
      }

      var data = yield getRowBody(this.req,{
        length: this.length,
        limit:  '1mb',
        encoding: this.charset
      });

      var content = yield Tool.parseXMLAsync(data);
      var message = Tool.formatMessage(content.xml);
      this.weixin = message;
      yield handler.call(this,next);
      weChat.reply.call(this);
    }

  }
}
