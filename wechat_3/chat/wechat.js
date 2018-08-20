/*
WeChat微信接口模块
*/
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var Fs = require('fs');
var _ = require('lodash');

var Tool = require('./tool');


var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
  access_token: prefix + 'token?grant_type=client_credential',
  temporary: {
    upload: prefix + 'media/upload?',
    fetch: prefix + 'media/get?'
  },
  permanent: {
    upload: prefix + 'material/add_material?',
    uploadNews: prefix + 'material/add_news?',
    uploadNewsPic: prefix + 'media/uploadimg?',
    fetch: prefix + 'material/get_material?',
    del: prefix + 'material/del_material?',
    update: prefix + 'material/update_news?',
    count: prefix + 'material/get_materialcount?',
    batch: prefix + 'material/batchget_material?'
  },
  tag: {
      create: prefix + 'tags/create?',
      fetch: prefix + 'tags/get?',
      update: prefix + 'tags/update?',
      del: prefix + 'tags/delete?'
  },
  mess: {
      tag: prefix + 'message/mass/sendall?',
      openId: prefix + 'message/mass/send?',
      del: prefix + 'message/mass/delete?',
      preview: prefix + 'message/mass/preview?',
      check: prefix + 'message/mass/get?'
  },
  menu: {
      create: prefix + 'menu/create?',
      fetch: prefix + 'menu/get?',
      del: prefix + 'menu/delete?',
      current: prefix + 'get_current_selfmenu_info?'
  }
}


function WeChat(options) {

  this.appID = options.appID;
  this.appSecret = options.appSecret;
  this.getAccessToken = options.getAccessToken;
  this.saveAccessToken = options.saveAccessToken;

}



WeChat.prototype.delMenu = function() {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
          .then(function(data) {

            var url = api.menu.del + 'access_token=' + data.access_token;

            request({url: url,json: true})
              .then(function(res) {

                  var _data = res.body;

                  if (_data) {
                      resolve(_data);
                  } else {
                      throw new Error('delete menu fail');
                  };

              })
              .catch(function(err) {
                  reject(err);
              });
          });
    });
};

WeChat.prototype.getCurrentMenu = function() {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
          .then(function(data) {

            var url = api.menu.current + 'access_token=' + data.access_token;

            request({url: url,json: true})
              .then(function(res) {

                  var _data = res.body;

                  if (_data) {
                      resolve(_data);
                  } else {
                      throw new Error('get current menu fail');
                  };

              })
              .catch(function(err) {
                  reject(err);
              });
          });
    });
};

WeChat.prototype.getMenu = function() {

    var that = this;

    return new Promise(function(resolve, reject) {
        that.fetchAccessToken()
          .then(function(data) {

              var url = api.menu.fetch + 'access_token=' + data.access_token;

              request({url: url,json: true})
                .then(function(res) {

                    var _data = res.body;

                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('get menu fail');
                    };

                })
                .catch(function(err) {
                    reject(err)
                })
          });
    });
};

WeChat.prototype.createMenu = function(menu) {

  var that = this;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.menu.create + 'access_token=' + data.access_token;

        request({method: 'POST',url: url,body: menu,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data)
              } else {
                  throw new Error('create menu fail');
              };

          })
          .catch(function(err) {
              reject(err)
          })
      })
  })
}




WeChat.prototype.checkMess = function (msgId) {

  var that = this;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.mess.check + 'access_token=' + data.access_token;
        var form = {msg_id: msgId};

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Send to TagUser fail');
              };

          })
          .catch(function(err) {
              reject(err);
          })
      })
  })
}

WeChat.prototype.previewMess = function (type, message, openId) {

  var that = this;
  var msg = {msgtype: type,touser: openId};

  msg[type] = message;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.mess.preview + 'access_token=' + data.access_token;

        request({method: 'POST',url: url,body: msg,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Send to TagUser fail');
              };

          })
          .catch(function(err) {
              reject(err);
          })
      })
  })
}

WeChat.prototype.delMess = function (msgId) {

  var that = this;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.mess.openId + 'access_token=' + data.access_token;
        var form = {msg_id: msgId}

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Send to TagUser fail');
              };

          })
          .catch(function(err) {
              reject(err);
          })
      })
  })
}

WeChat.prototype.sendByOpenId = function (type, message, openIds) {

  var that = this;
  //请求体参数
  var msg = {msgtype: type,touser: openIds};

  msg[type] = message;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.mess.openId + 'access_token=' + data.access_token;

        request({method: 'POST',url: url,body: msg,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Send to TagUser fail');
              };

          })
          .catch(function(err) {
              reject(err);
          })
      })
  })
}

WeChat.prototype.sendByTag = function (type, message, tagId) {

  var that = this;
  //请求体参数
  var msg = {filter: {},msgtype: type};

  msg[type] = message;
  //对传入的用户标签进行判断 如果有就针对用户发消息 如果没有就对所有用户发消息
  if (!tagId) {
      msg.is_to_all = true
  } else {
      msg.filter = {is_to_all: false, tag_id: tagId}
  }

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.mess.tag + 'access_token=' + data.access_token;

        request({method: 'POST',url: url,body: msg,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Send to TagUser fail');
              };

          })
          .catch(function(err) {
              reject(err);
          })
      })
  })
}




WeChat.prototype.delTag = function (id) {

  var that = this;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.tag.del + 'access_token=' + data.access_token;

        var form = {
            tag: {id: id}
        }

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Delete Material fail');
              };

          })
          .catch(function(err) {
              reject(err);
          });
      })
  })
}

WeChat.prototype.updateTag = function (id, name) {

  var that = this;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.tag.update + 'access_token=' + data.access_token;

        var form = {
            tag: {id: id,name: name}
        }

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Delete Material fail');
              };

          })
          .catch(function(err) {
              reject(err);
          });
      })
  })
}

WeChat.prototype.fetchTag = function () {

  var that = this;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.tag.fetch + 'access_token=' + data.access_token;

        request({url: url,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Delete Material fail');
              };

          })
          .catch(function(err) {
              reject(err);
          });
      })
  })
}

WeChat.prototype.createTag = function (name) {

  var that = this;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.tag.create + 'access_token=' + data.access_token;

        var form = {
            tag: {name: name}
        }

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Delete Material fail');
              };

          })
          .catch(function(err) {
              reject(err);
          });
      })
  })
}





WeChat.prototype.batchMaterial = function (options) {

  var that = this;

  //设置变量值
  options.type = options.type || 'image';
  options.offset = options.offset || 0;
  options.count = options.count || 1;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.permanent.batch + 'access_token=' + data.access_token;

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Delete Material fail');
              };

          })
          .catch(function(err) {
              reject(err);
          });
      })
  })
}

WeChat.prototype.countMaterial = function () {

  var that = this;

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.permanent.count + 'access_token=' + data.access_token;

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Delete Material fail');
              };

          })
          .catch(function(err) {
              reject(err);
          });
      })
  })
}

WeChat.prototype.updateMaterial = function(mediaId, news) {

  var that = this;
  var form = {media_id: mediaId};

  //让form继承传进来的news
  _.extend(form, news);

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.permanent.update + 'access_token=' + data.access_token + '&media_id=' + mediaId;

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Delete Material fail');
              };

          })
          .catch(function(err) {
              reject(err);
          });
      })
  })
}

WeChat.prototype.deleteMaterial = function (mediaId) {

  var that = this;
  var form = {media_id: mediaId};

  return new Promise(function(resolve, reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = api.permanent.del + 'access_token=' + data.access_token + '&media_id=' + mediaId;

        request({method: 'POST',url: url,body: form,json: true})
          .then(function(response) {
              var _data = response.body;
              if (_data) {
                  resolve(_data);
              } else {
                  throw new Error('Delete Material fail');
              };

          })
          .catch(function(err) {
              reject(err);
          });
      })
  })
}

WeChat.prototype.fetchMaterial = function (mediaId, type, permanent) {

  var that = this;
  var fetchUrl = api.temporary.fetch;

  if (permanent) {
      fetchUrl = api.permanent.fetch;
  };

  return new Promise(function (resolve,reject) {
    that.fetchAccessToken()
      .then(function (data) {

        var url = fetchUrl + 'access_token=' + data.access_token + '&media_id=' + mediaId;
        var options = {
            method: 'POST',
            url: url,
            json: true
        };
        var form = {};

        if(permanent){
            form.media_id= mediaId;
            form.access_token= data.access_token;
            options.body = form;
        }else{
            if(type === 'video'){
                url = url.replace('https://','http://')
            };
            url += '&media_id=' + mediaId;
        };

        if(type === 'news' || type === 'video'){
            request(options)
            .then(function(response) {
                var _data = response.body;
                if (_data) {
                    resolve(_data);
                } else {
                    throw new Error('fetch Material fail');
                };
            });
        }else{
            resolve(url);
        }
      })
  })
}

WeChat.prototype.uploadMaterial = function (type,material,permanent) {

  var that = this;
  var form = {};
  var uploadUrl = api.temporary.upload;

  //对permanent参数进行判断 如果传入permanent参数 则新增永久素材
  if(permanent){
      uploadUrl = api.permanent.upload;
      //让form兼容所有的上传类型
      _.extend(form, permanent);
  }
  //判断上传类型 指定对应的uploadUrl material如果是图文的时候传进来的是一个数组 如果是图片或视频的话 传进来的是一个路径
  if(type === 'pic'){
      uploadUrl = api.permanent.uploadNewsPic;
  };
  if(type === 'news'){
      uploadUrl = api.permanent.uploadNews;
      form = material;
  }else{
      form.media = Fs.createReadStream(material);
  };



  return new Promise(function (resolve,reject) {

    that.fetchAccessToken()
      .then(function (data) {

        var url = uploadUrl + 'access_token=' + data.access_token;
        //进行判断 如果不是永久素材 则上传临时素材
        if(!permanent){
            url += '&type=' + type;
        }else{
            form.access_token = data.access_token;
        }
        //定义上传的参数
        var options = {
            method: 'POST',
            url: url,
            json: true
        };
        //素材类型不同 上传方式不同
        if(type === 'news'){
            options.body = form;
        }else{
            options.formData = form;
        }

        request(options)
          .then(function (res) {

            var _data = res.body;

            if (_data) {
              resolve(_data)
            } else {
              throw new Error('Upload Material fail');
            }

          })
          .catch(function (err) {
            reject(err)
          })

      })

  })
}





WeChat.prototype.fetchAccessToken = function () {

  var that = this;

  if (this.access_token && this.expires_in) {
    if(this.isValidAccessToken(this)){
      return Promise.resolve(this);
    }
  }

  return that.getAccessToken()
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
