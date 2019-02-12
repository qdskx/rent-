var app = getApp();
// pages/order/detail.js
Page({
  data:{
    orderId:0,
    orderData:{},
    proData:[],
    messages:'',
    user_rank:0
  },
  onLoad:function(options){

    this.setData({
      orderId: options.orderId,
      user_rank: app.globalData.userInfo['user_rank'] ? app.globalData.userInfo['user_rank'] : 0,
    })
    this.loadProductDetail();
  },
  loadProductDetail:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_details',
      method:'post',
      data: {
        order_id: that.data.orderId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        var status = res.data.status;
        if(status==1){
          var pro = res.data.pro;
          var ord = res.data.ord;
          var messages = Object.keys(ord).length;
          that.setData({
            orderData: ord,
            proData:pro,
            messages: messages
          });
          wx.hideLoading()
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
      }
    });
  },

})