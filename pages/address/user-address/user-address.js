// pages/address/user-address/user-address.js
var app = getApp()
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id:0,
    num:0,
    cartId:0,
    orderId:''
  },
  onLoad: function (options) {
    if(!app.d.userId){
      wx.redirectTo({
        url: '/pages/certify/certify',
      })
      return;
    }
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var cartId = options.cartId ? options.cartId : '';
    var orderId = options.orderId ? options.orderId : '';
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/index',
      data: {
        user_id:app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var address = res.data.adds;
        if (address == '') {
          var address = []
        }
        
        that.setData({
          address: address,
          cartId: cartId,
          orderId:orderId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },

  onReady: function () {
    // 页面渲染完成
  },
  setDefault: function(e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/set_default',
      data: {
        uid:app.d.userId,
        addr_id:addrId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var status = res.data.status;
        var cartId = that.data.cartId;
        var orderId = that.data.orderId;
        if(status==1){
          if (cartId) {
            wx.redirectTo({
              url: '../../order/pay?cartId=' + cartId,
            });
            return false;
          }
          if (orderId) {
            wx.redirectTo({
              url: '../../backgoods/backgoods?orderId=' + orderId,
            });
            return false;
          }

          wx.showToast({
            title: '操作成功！',
            duration: 2000
          });
          
          that.DataonLoad();
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
    })
  },
  editAddr:function(e){
    var addr = e.currentTarget.dataset.arr;
    wx.redirectTo({
      url: '/pages/editaddr/editaddr?pages=address&addr=' + JSON.stringify(addr),
    })
  },
  delAddress: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Address/del_adds',
          data: {
            user_id:app.d.userId,
            id_arr:addrId
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          
          success: function (res) {
            // success
            var status = res.data.status;
            if(status==1){
              that.DataonLoad();
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
      }
    });

  },
  DataonLoad: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/index',
      data: {
        user_id:app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var address = res.data.adds;
        if (address == '') {
          var address = []
        }
        that.setData({
          address: address,
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },
})