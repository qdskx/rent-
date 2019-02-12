// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    isStatus: 'pay',//订单状态{0,已取消10待付款20待发货30待收货33租赁中36已归还39归还中40待评价50交易完成51交易关闭
    page: 0,
    refundpage: 0,
    orderList0: [],
    orderList1: [],
    orderList2: [],
    orderList3: [],
    orderList4: [],
    orderList5: [],
    orderList6: [],
    orderList7: [],
    viewleft: 0,

    now:''
  },
  onLoad: function (options) {
    if (!app.d.userId) {
      wx.redirectTo({
        url: '/pages/certify/certify',
      })
      return;
    } else {
      this.initSystemInfo();
      showView: (options.showView == "true" ? true : false);
      this.setData({
        currentTab: parseInt(options.currentTab),
        isStatus: options.otype
      });
      if (this.data.currentTab == 7) {
        this.loadReturnOrderList();
      } else {
        this.loadOrderList();
      }
    }

    this.getCurrentTime()

  },
  // getOrderStatus:function(){
  //   return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  // },

  getCurrentTime:function(){

    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);

    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var h = date.getHours();
    //分
    var m = date.getMinutes();
    //秒
    var s = date.getSeconds();

    var now = Y + '-' + M + '-' + D + ' ' + "00:00:00";

    this.setData({
      now:now
    })

    console.log(now);

    console.log("当前时间：" + Y + '-' + M + '-' + D + ' ' + "00:00:00");

  },

  //取消订单
  removeOrder: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method: 'post',
          data: {
            id: orderId,
            type: 'cancel',
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
            } else {
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

  //确认收货
  recOrder: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定已收到宝贝吗？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method: 'post',
          data: {
            id: orderId,
            type: 'receive',
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
            } else {
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

  // 续租
  renew: function () {
    wx.showToast({
      title: '功能未开通',
      icon: 'loading',
    })
  },
  getlog: function () {
    wx.showToast({
      title: '功能开通中',
      icon: 'loading'
    })
  },
  //归还器材
  backGood: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定归还器材吗？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method: 'post',
          data: {
            id: orderId,
            type: 'backGood',
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
            } else {
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

  loadOrderList: function () {

    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/index',
      method: 'post',
      data: {
        uid: app.d.userId,
        order_type: that.data.isStatus,
        page: that.data.page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data  
        // console.log(res);
        var status = res.data.status;
        var list = res.data.ord;

        switch (that.data.currentTab) {
          case 0:
            that.setData({
              orderList0: list,
            });
            break;
          case 1:
            that.setData({
              orderList1: list,
            });
            break;
          case 2:
            that.setData({
              orderList2: list,
            });
            break;
          case 3:
            that.setData({
              orderList3: list,
            });
            break;
          case 4:
            that.setData({
              orderList4: list,
            });
            break;
          case 5:
            that.setData({
              orderList5: list,
            });
            break;
          case 6:
            that.setData({
              orderList6: list,
            });
            break;
          case 7:
            that.setData({
              orderList7: list,
            });
            break;
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

  loadReturnOrderList: function () {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_refund',
      method: 'post',
      data: {
        uid: app.d.userId,
        page: that.data.refundpage,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data       
        console.log(res);
        var data = res.data.ord;
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            orderList7: that.data.orderList7.concat(data),
          });
        } else {
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
  },

  // returnProduct:function(){
  // },
  initSystemInfo: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    // e.target.dataset.otype采用现在的布局是拿不到值的, 故e.currentTarget.dataset.current
    var that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      var current = e.currentTarget.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.currentTarget.dataset.otype,
      });

      //没有数据就进行加载
      switch (that.data.currentTab) {
        case 0:
          !that.data.orderList0.length && that.loadOrderList();
          break;
        case 1:
          !that.data.orderList1.length && that.loadOrderList();
          break;
        case 2:
          !that.data.orderList2.length && that.loadOrderList();
          break;
        case 3:
          !that.data.orderList3.length && that.loadOrderList();
          break;
        case 4:
          !that.data.orderList4.length && that.loadOrderList();
          break;
        case 5:
          !that.data.orderList5.length && that.loadOrderList();
          break;
        case 6:
          !that.data.orderList6.length && that.loadOrderList();
          break;
        case 7:
          that.data.orderList7.length = 0;
          that.loadReturnOrderList();
          break;

      }
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  payOrderByWechat: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var order_sn = e.currentTarget.dataset.ordersn;

    if (!order_sn) {
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order_id,
        order_sn: order_sn,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 3000);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  /**
   * 调用服务器微信统一下单接口创建一笔微信预订单
   */
  //   prePayWechatOrder: function(orderId){
  //     var uri = "/ztb/userZBT/GetWxOrder";
  //     var method = "post";
  //     var dataMap = {
  //       SessionId: app.globalData.userInfo.sessionId,
  //       OrderNo: orderId
  //     }
  //     console.log(dataMap);
  //     var successCallback = function (response) {
  //       console.log(response);
  //     };
  //     common.sentHttpRequestToServer(uri, dataMap, method, successCallback);
  //   }

  // 在待付款页面发起支付宝支付
  payOrderByAlipay: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var order_sn = e.currentTarget.dataset.ordersn;

    if (!order_sn) {
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/alipay/alipay?order_id=' + order_id + '&order_sn=' + order_sn + '&userId=' + app.d.userId + '&paytype=alipay',
    })
  },


  // 监测滚动的事件
  scrollMove: function (e) {
    console.log(e);
    // 0~224.6
    var left = e.detail.scrollLeft;
    this.setData({
      viewleft: left
    })
  },

  // 支付宝预授权-冻结
  payOrderByPreauth:function(e){
    var order_id = e.currentTarget.dataset.orderid;
    var order_sn = e.currentTarget.dataset.ordersn;

    if (!order_sn) {
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/alipay/alipay?order_id=' + order_id + '&order_sn=' + order_sn + '&userId=' + app.d.userId + '&paytype=preauth',
    })
  },

  // 银联预授权支付
  payOrderByUnionpay:function(e){
    var order_id = e.currentTarget.dataset.orderid;
    var order_sn = e.currentTarget.dataset.ordersn;

    if (!order_sn) {
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/alipay/alipay?order_id=' + order_id + '&order_sn=' + order_sn + '&userId=' + app.d.userId + '&paytype=unionpay',
    })
  }
})