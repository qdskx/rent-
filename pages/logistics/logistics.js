// pages/logistics/logistics.js
var app = getApp();
Page({
  data: {
    orderId: 0,
    mailno:'',
    list: []
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
    })
    this.loadLogisticsDetail();
  },
  loadLogisticsDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/logistics_details',
      method: 'post',
      data: {
        order_id: that.data.orderId,
        type:''
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        var status = res.data.status;
        if (status == 1) {
          var osn = res.data.mailno;
          var log = res.data.log;
          that.setData({
            mailno: osn,
            list: log
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 1500,
            icon:'none'
          });
          setTimeout(function () {
            wx.navigateBack({
              delta:1
            })
          }, 1500)
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
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
