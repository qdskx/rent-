// pages/backinfo/backinfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:0,
    order_sn:'',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
    })
    this.loadOrderInfo();
  },
  loadOrderInfo:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/logistics_details',
      method: 'post',
      data: {
        order_id: that.data.orderId,
        type:'back'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var osn = res.data.mailno;
          var log = res.data.log;
          that.setData({
            mailno: osn,
            list: log,
          });
        } else {
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
  //取消物流下单
  delLog:function(){
    var that = this;
    wx.showModal({
      title: '取消订单',
      content: '确定取消预约取件？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/cancel_log',
          method: 'post',
          data: {
            order_id: that.data.orderId,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: res.data.succ,
                duration: 2000
              });
              wx.redirectTo({
                url: '../user/dingdan?currentTab=3&otype=zu',
              })
            } else {
              wx.showToast({
                title: res.data.err,
                duration: 2000,
                icon: 'none'
              });
              return;
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
      }
    }
    )

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})