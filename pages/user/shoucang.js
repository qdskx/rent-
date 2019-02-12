var app = getApp();
// pages/user/shoucang.js
Page({
  data:{
    page:1,
    collectData:[],
  },
  onLoad:function(options){
    if (!app.d.userId) {
      wx.redirectTo({
        url: '/pages/certify/certify',
      })
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.loadProductData();
  },
  onShow:function(){
    // 页面显示
    this.loadProductData();
  },
  removeFavorites:function(e){
    var that = this;
    var pid = e.currentTarget.dataset.favid;
    wx.showModal({
      title: '提示',
      content: '你确定取消收藏吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/User/collection_qu',
          method:'post',
          data: {
            uid:app.d.userId,
            pid: pid,
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //todo
            if (res.data.status == 1){
              that.loadProductData();
            }else {
              wx.showToast({
                title: res.data.err,
                icon:'none'
              })
            }
          },
        });

      }
    });
  },
  loadProductData:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/collection',
      method:'post',
      data: {
        uid: app.d.userId,
        // pageindex: that.data.page,
        // pagesize:100,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.sc_list;
        that.setData({
          collectData: data,
        });
        wx.hideLoading();
      },
    });
  },
  initProductData: function (data){
    for(var i=0; i<data.length; i++){
      //console.log(data[i]);
      var item = data[i];

      item.Price = item.Price/100;
      item.ImgUrl = app.d.hostImg + item.ImgUrl;

    }
  },
});