// pages/rent/rent.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid:5,
    pid:5,
    question:{},
    classname:{},
    currentTab: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      cid: options.id
    })

    // 得到租赁指南的所有分类
    wx.request({
      url: app.d.ceshiUrl + '/api/system/getclassname',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        that.setData({
          classname:res.data
        })
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
    var that = this
    // 得到租赁指南-租赁规则的问题
    wx.request({
      url: app.d.ceshiUrl + '/api/system/getquestion',
      method: 'post',
      data: {
        smallid: that.data.currentTab
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          question: res.data
        })
      }
    })
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

  },





  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {

    // console.log(this.data.currentTab); 上一个id
    // console.log(e.target.dataset.current); 现在的id
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })

      wx.request({
        url: app.d.ceshiUrl + '/api/system/getquestion',
        method: 'post',
        data: {
          smallid: that.data.currentTab
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
            question: res.data
          })
        }
      })

    }

  }



  
})