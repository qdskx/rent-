// pages/alipay/alipay.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    order_sn: '',
    userId: '',
    paytype: '',
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      order_id: options.order_id,
      order_sn: options.order_sn,
      userId: options.userId,
      paytype: options.paytype,
      total: options.total
    })
  },

  /**
* 点击复制文本
*/
  copyText: function (e) {
    var that = this

    // 支付宝的支付、续租
    if (that.data.paytype == 'alipay') {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text + '?V0lFKLFDT0tMVlM=' + that.data.paytype + '&ZHdpZGY7bGQuGj=' + that.data.order_id + '&c2ZqamY1MjYzsdr=' + that.data.order_sn + '&MzReJnNhZ2Rqaw=' + that.data.userId + '&ryd3R5eG01JV4=' + that.data.total,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
      // 支付宝预授权的支付
    }  else if (that.data.paytype == 'preauth') {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text + '?cGF5dHlwZQ=' + that.data.paytype + '&b3JkZXJJRA=' + that.data.order_id + '&b3V0X29yZGVyX25v=' + that.data.order_sn + '&dXNlcklk=' + that.data.userId,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })

              console.log(e.currentTarget.dataset.text + '?cGF5dHlwZQ=' + that.data.paytype + '&b3JkZXJJRA=' + that.data.order_id + '&b3V0X29yZGVyX25v=' + that.data.order_sn + '&dXNlcklk=' + that.data.userId + '&YW1vdXQ=' + that.data.total);
            }
          })
        }
      })

    // 银联支付
    } else if(that.data.paytype == 'unionpay'){
      wx.setClipboardData({
        data: e.currentTarget.dataset.text + '?rby3JkZXJJZA=' + that.data.order_id + '&cGF5dHlwZQ=' + that.data.paytype + '&fby3JkZXJTbg=' + that.data.order_sn + '&dW5pb25wYXl1c2VyaWQ=' + that.data.userId,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })

              console.log(e.currentTarget.dataset.text + '?cGF5dHlwZQ=' + that.data.paytype + '&rby3JkZXJJZA=' + that.data.order_id + '&fby3JkZXJTbg=' + that.data.order_sn + '&dW5pb25wYXl1c2VyaWQ=' + that.data.userId);
            }
          })
        }
      })
    } 

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