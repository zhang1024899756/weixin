/*
tool为处理XML数据的工具包
*/

var Xml2js = require('xml2js');
var Promise = require('bluebird');

var Template = require('./template');

exports.template = function (content,message) {

  var info = {}
  var type = 'text';
  var fromUserName = message.FromUserName;
  var toUserName = message.ToUserName;

  if (Array.isArray(content)) {
    type = 'news';
  }

  type = content.type || type;
  info.content = content;
  info.createTime = new Date().getTime();
  info.msgType = type;
  info.toUserName = fromUserName;
  info.fromUserName = toUserName;

  return Template.compiled(info);
}

exports.parseXMLAsync = function (xml) {
  return new Promise(function (resolve,reject) {
    Xml2js.parseString(xml,{trim: true},function (err,content) {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    });
  })
}

function formatMessage(result) {
  var message = {}

  if (typeof result === 'object') {
    var keys = Object.keys(result)
    //console.log(keys);
    for (var i = 0; i < keys.length; i++) {
      var item = result[keys[i]]
      var key = keys[i]

      if (!(item instanceof Array) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        var val = item[0]

        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        }
        else {
          message[key] = (val || '').trim()
        }
      }
      else {
        message[key] = []

        for (var j = 0, k = item.length; j < k; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  //console.log(message);
  return message
}
exports.formatMessage = formatMessage;
