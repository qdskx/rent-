// pages/classify/classify.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:{},
    typeTree:{},
    currentTab:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.defaultClass()
  },

  // 分类默认展示内容
  defaultClass:function(){
    var that = this
    wx.request({
      url: app.d.ceshiUrl + '/Api/Category/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        // console.log(res);
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.list;
          var catList = res.data.catList;
          that.setData({
            types: list,
            typeTree: catList,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
      }
    })
  },

  // 品牌相机下的内容
  brandClass:function(){
    var that = this
    wx.request({
      url: app.d.ceshiUrl + '/Api/brand/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        // console.log(res);
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.list;
          var first = res.data.first;
          that.setData({
            types: list,
            typeTree: first
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
        that.setData({
          currType: 2
        });

      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },

    });  
  },

  // 分类下的切换内容展示
  tapType: function (e) {
    var that = this;
    const currType = e.currentTarget.dataset.typeId;

    that.setData({
      currType: currType
    });
    // console.log(currType);
    wx.request({
      url: app.d.ceshiUrl + '/Api/Category/getcat',
      method: 'post',
      data: { cat_id: currType },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var catList = res.data.catList;
          that.setData({
            typeTree: catList,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      }
    });
  },

  // 品牌分类点击切换的内容
  tapType2: function (e) {
    var that = this;
    const currType = e.currentTarget.dataset.typeId;

    that.setData({
      currType: currType
    });
    // console.log(currType);
    wx.request({
      url: app.d.ceshiUrl + '/Api/brand/getcat',
      method: 'post',
      data: { brand_id: currType },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var brandList = res.data.brandList;
          that.setData({
            typeTree: brandList,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      }
    });
  },


  clickTab:function(e){
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })

      if (e.target.dataset.current == 0) {
        that.defaultClass()
      } else {
        that.brandClass()
      }
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