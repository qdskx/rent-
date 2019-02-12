// pages/renew/renew.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    payPrice:'0.00',
    orderData: {},
    proData: [],
    dayprice:'',
    renewDays:0,
    total:'',

    // 线下和支付宝的默认状态
    btnDisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
    })
    this.loadProductDetail();
  },
  //获取订单详情
  loadProductDetail: function () {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/renew_details',
      method: 'post',
      data: {
        order_id: that.data.orderId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res);
        var status = res.data.status;
        if (status == 1) {
          var pro = res.data.pro;
          var ord = res.data.ord;
          var dprice = res.data.dayprice;
          that.setData({
            orderData: ord,
            proData: pro,
            dayprice:dprice
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

  //时间改变
  bindDateChange: function (e) {
    var endtime = e.detail.value;
    if (endtime == this.data.orderData.enddate){
      wx.showToast({
        title: '最少续租天1天',
        icon:'none'
      })
      return false;
    }else{
      var ortime = new Date(this.data.orderData.enddate);
      var dat = new Date(endtime);
      var renewDays = (dat - ortime) / 86400000;
      var zj = this.data.dayprice * renewDays;
      var zprice = this.changeMoney(zj);
      console.log(zprice);
    this.setData({
      total: zj,
      date: endtime,
      renewDays: renewDays,
      payPrice: zprice
    })
    }
  },
  //确认续租
  checkout:function(){
    var that = this;
    if (this.data.renewDays < 1){
      wx.showToast({
        title: '请选择日期',
        icon:'none'
      })
      return false;
    }
    //后台校验数据
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/renew_confirm',
      method: 'post',
      data: {
        order_id:that.data.orderId,
        days: this.data.renewDays,
        total: this.data.total,
        paytype:'weixin'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if (data.status == 1) {
          //创建订单成功
          if (data.arr.pay_type == 'weixin') {
            //微信支付
            that.wxpay(data.arr);
          }
        } else {
          wx.showToast({
            title: data.err,
            duration: 2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },
  //调起微信支付
  wxpay: function (order) {
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order.order_id,
        order_sn: order.order_sn,
        uid: app.d.userId,
        paytype:'renew',
        total:this.data.total
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
                wx.switchTab({
                  url: '/pages/user/user',
                });
              }, 2500);
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
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },
  //金额转换
  changeMoney:function(num){
    if (num) {
      if (isNaN(num)) {
        alert("金额中含有不能识别的字符");
        return;
      }
      num = typeof num == "string" ? parseFloat(num) : num//判断是否是字符串如果是字符串转成数字
      num = num.toFixed(2);//保留两位
      num = parseFloat(num);//转成数字
      num = num.toLocaleString();//转成金额显示模式
      //判断是否有小数
      if (num.indexOf(".") == -1) {
        num = "￥" + num + ".00";
      } else {
        num = num.split(".")[1].length < 2 ? "￥" + num + "0" : "￥" + num;
      }
      return num;
    } else {
      return num = null;
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

  },


  // 线下续租
  createProductOrderByXX:function(){
    wx.showToast({
      title: '请自行联系商家！',
      duration:2000
    })
    // setTimeout(function(){
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   })
    // } , 3000)
  },


  // 支付宝续租
  createProductOrderByAlipay:function(){
    var that = this
    var order = that.data.orderData
    if (this.data.renewDays < 1) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return false;
    }
    //后台校验数据
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/renew_confirm',
      method: 'post',
      data: {
        order_id:that.data.orderId,
        days: that.data.renewDays,
        total: that.data.total,
        paytype:'alipay'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if (data.status == 1) {
          //创建订单成功
          if (data.arr.pay_type == 'alipay') {
            wx.redirectTo({
              url: '/pages/alipay/alipay?order_id=' + order.id + '&order_sn=' + order.order_sn + '&userId=' + app.d.userId + '&paytype=renew' + '&total=' + that.data.total,
            })
          }
        } else {
          wx.showToast({
            title: data.err,
            duration: 2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });

  },





})