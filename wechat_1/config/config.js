/*
config配置文件
*/
var Path = require('path');
var Util = require('../libs/util');

var access_token_file = Path.join(__dirname,'./access_token.txt');

var config = {
  wechat: {
    appID: 'wx6ec95a69fa67b070',
    appSecret: '88acbe561b99adfe7a6f12ceba0ae51a',
    token: 'wFFwjMeWGXhWcqt1Ue2TYSQPdiABRSdt',
    getAccessToken: function () {
      return Util.readFileAsync(access_token_file);
    },
    saveAccessToken: function (data) {
      var _data = JSON.stringify(data);
      return Util.writeFileAsync(access_token_file,_data)
    }
  }
}
module.exports = config;
