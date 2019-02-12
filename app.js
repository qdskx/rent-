// app.js
App({
  d: {
    //test
    hostUrl: 'https://localhost/shop/wechat_shop1/index.php',
    hostImg: 'http://img.ynjmzb.net',
    hostVideo: 'http://zhubaotong-file.oss-cn-beijing.aliyuncs.com',
    userId: null,
    appId:"wx71ad32d54d48ef66",
    appKey:"2b533fc9286c453198fc56104dd05196",
    ceshiUrl:'https://www.sjfpro.com/shop/wechat_shop1/index.php',
    // ceshiUrl:'http://www.wechatadmin.com/index.php',
  },
  onLaunch: function () {

    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //调用应用实例的方法获取全局数据
    that.getUserInfo(function (userInfo) {
      console.log(userInfo)
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (JSON.stringify(that.globalData.userInfo) != "{}") {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {

      
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          //get wx user simple info
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
              //get user sessionKey
              //get sessionKey
              that.getUserSessionKey(code);
              
            }
          });
        }
      });
    }
  },
  getUserSessionKey:function(code){
    //用户的订单状态
    var that = this;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/getsessionkey',
      method:'post',
      data: {
        code: code
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data      
        var data = res.data;
        if(data.status==0){
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }

        that.globalData.userInfo['sessionId'] = data.session_key;
        that.globalData.userInfo['openid'] = data.openid;
        that.onLoginUser();

        

      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },
  onLoginUser:function(){
    var that = this;
    var user = that.globalData.userInfo;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/authlogin',
      method:'post',
      data: {
        SessionId: user.sessionId,
        gender:user.gender,
        NickName: user.nickName,
        HeadUrl: user.avatarUrl,
        openid:user.openid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.arr;
        var status = res.data.status;
        if(status!=1){
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }
        that.globalData.userInfo['id'] = data.ID;
        that.globalData.userInfo['NickName'] = data.NickName;
        that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        that.globalData.userInfo['user_rank'] = data.user_rank;
        that.globalData.userInfo['isCertify'] = data.isCertify;
        that.globalData.userInfo['freedepositNum'] = data.freedepositNum;
        that.globalData.flag = 2;
        //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (that.userInfoCallback) {
          that.userInfoCallback(data);
        }

        // 拿到用户的订单数据
        that.getOrderInfo(data.ID);
        // 购物车数据
        that.getCartData(data.ID);

        var userId = data.ID;
        if (!userId){
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
        that.d.userId = userId;

      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });
  },
  getOrBindTelPhone:function(returnUrl){
    var user = this.globalData.userInfo;
    if(!user.tel){
      wx.navigateTo({
        url: 'pages/binding/binding'
      });
    }
  },

  getOrderInfo:function(id){
    //获取用户订单数据
    var that = this;
    wx.request({
      url: that.d.ceshiUrl + '/Api/User/getorder',
      method: 'post',
      data: {
        userId: id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        // console.log(res);        
        var status = res.data.status;
        if (status == 1) {
          that.globalData.order = res.data.orderInfo;
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！err:loadOrderStatus',
          duration: 2000
        });
      }
    });
  },


  // 购物车数据
  getCartData:function(id){
    var that = this;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Shopping/index',
      method: 'post',
      data: {
        user_id: id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var cart = res.data.cart;

        for (var i = 0; i < cart.length; i++) {
          cart[i]['startdate'] = cart[i]['startdate'].slice(0, 10);
        }
        that.globalData.carts = cart;
        //endInitData
      },
    });
  },

 globalData:{
    userInfo:{},
    flag:null,
    carts:{},
    order:{},
    // 加密过后的用户id
    secUid:''
  },

  onPullDownRefresh: function (){
    wx.stopPullDownRefresh();
  }






})







