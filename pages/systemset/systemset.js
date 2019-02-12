// pages/systemset/systemset.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setcontent:{},
    uid:app.d.userId,
    // 用户是否是登录状态的标记 默认0：登录状态
    isLoginout:0
  },

  // 退出登录
  loginout:function(){
    var that = this;
    app.globalData.userInfo = {};
    wx.setStorageSync('order' , '')
    wx.clearStorageSync();
    app.d.userId = null;
    app.globalData.isLoginout = 1;
    wx.reLaunch({
        url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.flag == 3;
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
   
   var that = this;

    // 判断用户是否是登录的状态
    // if(app.globalData.isLoginout == 0){
    //   that.setData({
    //     uid:app.d.userId,
    //     isLoginout:0
    //   })
    // }else{
    //   that.setData({
    //     uid:null,
    //     isLoginout:1
    //   })
    // }


    wx.request({
      url: app.d.ceshiUrl + '/api/system/classify',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        // console.log(res.data);
        that.setData({
          setcontent:res.data
        })
      }
    })

    // if(app.globalData.flag == 2){
    //   that.setData({
    //     status:1
    //   })
    // }else{
    //   that.setData({
    //     status: 0
    //   })
    // }


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