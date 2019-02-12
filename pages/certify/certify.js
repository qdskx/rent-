var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.globalData.flag = 5;
  },
  onAuth:function () {
    var that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: function (result){
              if (result.code) {
                var code = result.code;
                wx.getUserInfo({
                  success: function (res) {
                    app.globalData.userInfo = res.userInfo;
                    
                    app.getUserSessionKey(code);
                    if (that.userInfoReadyCallback) {
                      that.userInfoReadyCallback(res)
                    }
                  }
                })
                wx.reLaunch({
                  url: '../index/index',
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          })
        }
      }
    })
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
    app.globalData.flag = 5;
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

    // var page = getCurrentPages().pop();
    // // console.log(getCurrentPages()[0].route);
    // if (getCurrentPages()[0].route == 'pages/user/user'){
    //   wx.switchTab({
    //     url: '/pages/user/user',
    //   })
    // } 
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
  
  },

})