/*
事件回复方法规则
*/
exports.reply = function *(next) {

  var message = this.weixin;
  //判断用户行为 是事件推送还是普通消息 先判断的是事件推送
  if (message.MsgType === 'event') {

    //订阅事件 分为搜索订阅和二维码订阅
    if (message.Event === 'subscribe') {
        if (message.EventKey) {
            console.log('扫描二维码进来' + message.EventKey + ' ' + message.ticket);
        }
        //通过this.body设置回复消息
        this.body = '欢迎订阅我的公众号';
    }
    //取消订阅事件
    else if (message.Event === 'unsubscribe') {
        console.log('用户取消了关注');
        this.body = '';
    }
    //地理位置事件
    else if (message.Event === 'LOCATION') {
        this.body = '您上报的位置是：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
    }
    //点击事件 自定义菜单事件
    else if (message.Event === 'CLICK') {
        this.body = '您点击了菜单：' + message.EventKey;
    }
    //跳转链接事件 点击菜单跳转链接时的事件推送
    else if (message.Event === 'VIEW') {
        this.body = '您点击了菜单中的链接：' + message.EventKey;
    }
    //扫描事件
    else if (message.Event === 'SCAN') {
        console.log('关注后扫描二维码' + message.EventKey + ' ' + message.Ticket);
        this.body = '看到你扫一下哦';
    }
  }
  //普通消息 文本消息
  else if (message.MsgType === 'text') {
    var content = message.Content;
    //除了回复策略里的内容就回复这句
    var reply = '额，你说的' + message.Content + '太复杂了，我理解不了';
    //回复策略--文本
    if (content === '1') {
        reply = '我是回复策略中的第一条';
    } else if (content === '2') {
        reply = '我是回复策略中的第二条';
    } else if (content === '3') {
        reply = '我是回复策略中的第三条';
    }
    //回复策略--图文
    else if(content === '4'){
        reply = [{
            title:'放开她，让我来！',
            description:'放开她，让我来！',
            picUrl:'http://ww2.sinaimg.cn/large/bd698b0fjw1eev97qkg05j20dw092dg3.jpg'
        },{
            title:'腿毛与秋裤',
            description:'腿毛与秋裤',
            picUrl:'http://upload.qqbody.com/allimg/1611/1203245I7-8.jpg'
        }]
    }

    this.body = reply;
  }

  yield next;

}
