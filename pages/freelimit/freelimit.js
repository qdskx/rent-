// pages/freelimit/freelimit.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCertify: app.globalData.userInfo['isCertify'],
    freedepositNum: app.globalData.userInfo['freedepositNum']
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (JSON.stringify(app.globalData.userInfo) == "{}"){
    //   wx.redirectTo({
    //     url: '/pages/certify/certify',
    //   })
    // }
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
    // if (JSON.stringify(app.globalData.userInfo) == "{}") {
    //   wx.redirectTo({
    //     url: '/pages/certify/certify',
    //   })
    // }else{

      if(!app.d.userId){
        wx.redirectTo({
          url: '/pages/certify/certify',
        })
      }else{

      var that = this;
      wx.request({
        url: app.d.ceshiUrl + '/api/zhimo/iscertify',
        method:'post',
        data:{
          userId:app.d.userId,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success:function(res){
          // console.log(res);
          that.setData({
            isCertify: res.data.isCertify,
            freedepositNum: res.data.freedepositNum
          });
          app.globalData.userInfo['isCertify'] = res.data.isCertify;
          app.globalData.userInfo['freedepositNum'] = res.data.freedepositNum; 
          // 加密过后的用户id
          app.globalData.secUid = res.data.secUid;         
        }
      })

    }
    
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