// pages/user/user.js
var app = getApp()
Page( {
  data: {
    userInfo: {},
    orderInfo:{},
    uid:app.d.userId,
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userListInfo: [ {
        icon: '../../images/iconfont-dingdan.png',
        text: '我的订单',
        isunread: true,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-card.png',
        text: '我的代金券',
        isunread: false,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-icontuan.png',
        text: '我的拼团',
        isunread: true,
        unreadNum: 1
      }, {
        icon: '../../images/iconfont-shouhuodizhi.png',
        text: '收货地址管理'
      }, {
        icon: '../../images/iconfont-kefu.png',
        text: '联系客服'
      }, {
        icon: '../../images/iconfont-help.png',
        text: '常见问题'
      }],
       loadingText: '加载中...',
       loadingHidden: false,
  },
  onLoad: function () {
      var that = this;
    // console.log(this);
    if (JSON.stringify(app.globalData.userInfo) != "{}"){
      that.setData({
        userInfo: app.globalData.userInfo
      })
    }else{
      app.userInfoCallback = userInfo => {
        if (JSON.stringify(userInfo) != '') {
        
          that.setData({
            userInfo: userInfo,
          });
        }
      }

    }
      this.loadOrderStatus();
  },
  onShow:function(){ 
      this.setData({
        uid:app.d.userId
      })
    this.loadOrderStatus();
  },
  loadOrderStatus:function(){

    //获取用户订单数据并且
    var that = this;

    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getorder',
      method:'post',
      data: {
        userId:app.d.userId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {

        //--init data
        // console.log(res);        
        var status = res.data.status;
        if(status==1){
          var orderInfo = res.data.orderInfo;
          that.setData({
            orderInfo: orderInfo
          });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！err:loadOrderStatus',
          duration: 2000
        });
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: '高清触手可及',
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

})