var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,
    messages: '',
    orderId: 0,
    addrId: 0,
    address: {},
    address2: { name: '盛嘉菲公司', phone: '18813161552', address: '北京市海淀区中关村海龙大厦1352' },

    isdis: 0,
    stime: '',
    etime: '',
    mornOraft: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var uid = app.d.userId;
    var that = this
    this.setData({
      userId: uid,
      orderId: options.orderId,
    });

    //获取有效期
    var curDate = new Date();
    var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000); //后一天
    var nextMonth = new Date(curDate.getTime() + 30 * 24 * 60 * 60 * 1000); //一个月
    var st = nextDate.getFullYear() + '-' + (nextDate.getMonth() + 1) + '-' + nextDate.getDate();
    var et = nextMonth.getFullYear() + '-' + (nextMonth.getMonth() + 1) + '-' + nextMonth.getDate();
    that.setData({
      stime: st,
      etime: et
    });
    this.loadAddrDetail();

  },
  loadAddrDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/address',
      method: 'post',
      data: {
        uid: that.data.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        var adds = res.data.adds;
        var messages = Object.keys(adds).length;
        // console.log(res);
        if (adds) {
          var addrId = adds.id;
          that.setData({
            address: adds,
            addrId: addrId,
            messages: messages
          });
        }
        //endInitData
      },
    });
  },
  getAddress: function () {
    wx.redirectTo({
      url: '../address/user-address/user-address?orderId=' + this.data.orderId,
    })
  },
  fromW: function () {
    wx.redirectTo({
      url: '../editaddr/editaddr?pages=backgoods&orderId=' + this.data.orderId + '&addr=' + JSON.stringify(this.data.address),
      success: function (res) {
        // success
        //  console.log(res)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //确认取件
  confirmOrder: function () {
    var that = this;
    wx.showModal({
      title: '订单确认',
      content: '确定要预约取件吗？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/sf_orders',
          method: 'post',
          data: {
            id: that.data.orderId,
            address: JSON.stringify(that.data.address),
            address2: JSON.stringify(that.data.address2)
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
                url: '/pages/user/dingdan?currentTab=3&otype=zu',
              });
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

  },

  // 捕捉归还方式的变化
  radioChange: function (e) {
    var that = this
    that.setData({
      isdis: e.detail.value
    })
  },
  // 捕捉线下归还,是上午归还还是下午归还
  radioChange2: function (e) {
    var that = this
    that.setData({
      mornOraft: e.detail.value
    })
  },

  // 捕捉线下归还,用户的归还日期
  bindDateChange: function (e) {
    this.setData({
      stime: e.detail.value
    })
  },

  // 确定按钮
  localBack: function () {
    var that = this;
    console.log(this.data.stime);
    console.log(this.data.mornOraft);
    console.log(this.data.isdis);
    if (!that.data.stime) {
      wx.showToast({
        title: '请选择归还时间！',
        duration: 2000
      })
      return;
    }
    var morn = '';
    if (that.data.mornOraft == 1) {
      morn = '09:00:00';
    } else if (that.data.mornOraft == 0) {
      morn = '03:00:00';
    }

    var pre_backtime = that.data.stime + ' ' + morn;


    wx.showModal({
      title: '订单确认',
      content: '确定要线下归还吗？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/offline_back',
          method: 'post',
          data: {
            id: that.data.orderId,
            pre_backtime: pre_backtime
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
                url: '/pages/user/dingdan?currentTab=3&otype=zu',
              });
            } else {
              wx.showToast({
                title: res.data.succ,
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

  }
})