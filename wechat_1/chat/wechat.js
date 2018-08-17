/*
access_token票据模块
*/

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var Tool = require('./tool');

var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
  access_token: prefix + 'token?grant_type=client_credential'
}


function WeChat(options) {
  this.appID = options.appID;
  this.appSecret = options.appSecret;
  this.getAccessToken = options.getAccessToken;
  this.saveAccessToken = options.saveAccessToken;
  var that = this;

  this.getAccessToken()
    .then(function (data) {

      try {
        data = JSON.parse(data);
      } catch (e) {
        return that.updateAccessToken();
      }

      if (that.isValidAccessToken(data)) {
        return Promise.resolve(data);
      } else {
        return that.updateAccessToken();
      }
    })
    .then(function (data) {
      //console.log(data);
      that.access_token = data.access_token;
      that.expires_in = data.expires_in;

      that.saveAccessToken(data)
      return Promise.resolve(data)
    })

}

WeChat.prototype.isValidAccessToken = function (data) {
  if (!data || !data.access_token || !data.expires_in) {
    return false;
  }

  var access_token = data.access_token;
  var expires_in = data.expires_in;
  var now = new Date().getTime()

  if (now < expires_in) {
    return true;
  } else {
    return false;
  }

};

WeChat.prototype.updateAccessToken = function () {
  var appID = this.appID;
  var appSecret = this.appSecret;
  var url = api.access_token + '&appid=' + appID + '&secret=' + appSecret;

  return new Promise(function (resolve,reject) {

    request({url: url,json: true})
      .then(function (res) {

        var data = res.body;
        var now = new Date().getTime();
        var expires_in = now + (data.expires_in - 20) * 1000;

        data.expires_in = expires_in;
        resolve(data)

      })

  })
};

WeChat.prototype.reply = function () {

  var content = this.body;
  var message = this.weixin;
  var xml = Tool.template(content,message);
  console.log('回复：' +　xml);
  this.status = 200;
  //设置回复的类型是xml格式
  this.type = 'application/xml';
  //设置回复主体
  this.body = xml;
}

module.exports = WeChat;
