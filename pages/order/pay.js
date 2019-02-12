var app = getApp();
// pages/order/downline.js
Page({
  data:{
    itemData:{},
    userId:0,
    user_rank:0,
    paytype:'weixin',//0线下1微信
    remark:'',
    cartId:0,
    addrId:0,//收货地址//测试--
    btnDisabled:false,
    productData:[],
    address:{},
    total:0,
    vprice:0,
    vid:0,
    addemt:1,
    vou:[],
    // 自提
    selfHave:0,
    isCertify:app.globalData.userInfo['isCertify'],
    freedepositNum: app.globalData.userInfo['freedepositNum'],
    // 免减金额
    avoid_reduction_amount:'',
    vip_reduction_amount:'',
    // 是否同意租赁合同
    isAgree:true,
    // 用户签名
    signature:''
  },
  // 自提
  radioChange:function(e){
    this.setData({
      selfHave:e.detail.value
    })
  },
  // 是否同意租赁条款
  checkboxChange(e){
    this.setData({
      isAgree:e.detail.value
    })
  },
  onLoad:function(options){
    // console.log(options.cartId);
    var uid = app.d.userId;
    this.setData({
      userId: uid,
      cartId: options.cartId,
      user_rank: app.globalData.userInfo['user_rank'] ? app.globalData.userInfo['user_rank']:0,
      isCertify:app.globalData.userInfo['isCertify'],
      freedepositNum:app.globalData.userInfo['freedepositNum']
    });

    this.loadProductDetail();

  },

  onShow(){
    this.loadProductDetail();
  },

  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/buy_cart',
      method:'post',
      data: {
        cart_id: that.data.cartId,
        uid: that.data.userId,
        // 是否自提 1自提 0顺丰 默认0
        iszt:that.data.selfHave
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //that.initProductData(res.data);
        var adds = res.data.adds;
        // console.log(res);
        if (adds){
          var addrId = adds.id;
          that.setData({
            address: adds,
            addrId: addrId
          });
        }
        that.setData({
          addemt: res.data.addemt,
          productData:res.data.pro,
          total: res.data.price,
          vprice: res.data.price,
          avoid_reduction_amount: res.data.avoid_reduction_amount,
          vip_reduction_amount: res.data.vip_reduction_amount,
          signature:res.data.signature,
          amount: res.data.amount,
        });
        //endInitData
      },
    });
  },

  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    })
  },

 //选择优惠券
  // getvou:function(e){
  //   var vid = e.currentTarget.dataset.id;
  //   var price = e.currentTarget.dataset.price;
  //   var zprice = this.data.vprice;
  //   var cprice = parseFloat(zprice) - parseFloat(price);
  //   this.setData({
  //     total: cprice,
  //     vid: vid
  //   })
  // }, 

//微信支付
  createProductOrderByWX:function(e){
    // 支付前判断是否有签名
    if (!this.data.signature) {
      wx.showToast({
        title: '请添加您的签名',
        icon:'none'
      })
      return;
    }

    // 对于是否同意本公司租赁条款的约定
    if(this.data.isAgree != 1){
      wx.showToast({
        title: '请阅读并同意本公司租赁条款',
        duration:2000
      })
      return;
    }
    this.setData({
      paytype: 'weixin',
    });
    // 判断有无收获地址
    if (!this.data.addrId) {
      wx.showToast({
        title: '请添加收货地址！',
        duration: 2500
      });
      return;
    }

    this.createProductOrder();
  },

  //线下支付
  createProductOrderByXX:function(e){
    // 支付前判断是否有签名
    if (!this.data.signature) {
      wx.showToast({
        title: '请添加您的签名',
      })
      return;
    }
    // 对于是否同意本公司租赁条款的约定
    if (this.data.isAgree != 1) {
      wx.showToast({
        title: '请阅读并同意本公司租赁条款',
        duration: 2000
      })
      return;
    }
    this.setData({
      paytype: 'cash',
    });
    
    // 判断有无收获地址
    if(!this.data.addrId){
      wx.showToast({
        title: '请添加收货地址！',
        duration: 2500
      });
      return;
    }
    this.createProductOrder();
    
    // 设置延时1000再跳转
    var timer = setTimeout(function(){
      wx.switchTab({
        url: '/pages/user/user'
      })
    } , 1000);

  },

  //确认订单
  createProductOrder:function(){
    this.setData({
      btnDisabled:false,
    })

    //创建订单
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/payment',
      method:'post',
      data: {
        uid: that.data.userId,
        cart_id: that.data.cartId,
        type:that.data.paytype,
        aid: that.data.addrId,//地址的id
        remark: that.data.remark,//用户备注
        price: that.data.total,//总价
        vid: that.data.vid,//优惠券ID
        is_zt:that.data.selfHave,//自提
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if(data.status == 1){
          //创建订单成功
          if(data.arr.pay_type == 'cash'){
              wx.showToast({
                 title:"请自行联系商家进行发货!",
                 duration:3000
              });
              return false;
          }
          if(data.arr.pay_type == 'weixin'){
            //微信支付
            that.wxpay(data.arr);
          }
          // 支付宝支付
          if(data.arr.pay_type == 'alipay'){
            that.alipay(data.arr);
          }
          // 支付宝预授权支付
          if (data.arr.pay_type == 'preauth') {
            that.preauth(data.arr);
          }
          // 银联预授权支付
          if (data.arr.pay_type == 'unionpay') {
            that.unionpay(data.arr);
          }
        }else{
          wx.showToast({
            title: data.err,
            duration:2500
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
  wxpay: function(order){
      wx.request({
        url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
        data: {
          order_id:order.order_id,
          order_sn:order.order_sn,
          uid:this.data.userId,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type':  'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){
          if(res.data.status==1){
            var order=res.data.arr;
            wx.requestPayment({
              timeStamp: order.timeStamp,
              nonceStr: order.nonceStr,
              package: order.package,
              signType: 'MD5',
              paySign: order.paySign,
              success: function(res){
                wx.showToast({
                  title:"支付成功!",
                  duration:2000,
                });
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/user/user',
                  });
                },2500);
              },
              fail: function(res) {
                wx.showToast({
                  title:res,
                  duration:3000
                })
              }
            })
          }else{
            wx.showToast({
              title: res.data.err,
              duration: 2000
            });
          }
        },
        fail: function() {
          // fail
          wx.showToast({
            title: '网络异常！err:wxpay',
            duration: 2000
          });
        }
      })
  },

  // 支付宝支付
  createProductOrderByAlipay:function(e){
    // 支付前判断是否有签名
    if (!this.data.signature) {
      wx.showToast({
        title: '请添加您的签名',
      })
      return;
    }
    // 对于是否同意本公司租赁条款的约定
    if (this.data.isAgree != 1) {
      wx.showToast({
        title: '请阅读并同意本公司租赁条款',
        duration: 2000
      })
      return;
    }
    this.setData({
      paytype: 'alipay',
    });

    // 判断有无收获地址
    if (!this.data.addrId) {
      wx.showToast({
        title: '请添加收货地址！',
        duration: 2500
      });
      return;
    }
    this.createProductOrder();
  },

  // 携带信息到复制链接页面
  alipay:function(order){
    wx.redirectTo({
      url: '/pages/alipay/alipay?order_id=' + order.order_id + '&order_sn=' + order.order_sn + '&userId=' + this.data.userId +'&paytype=alipay',
    })
  },


  // 支付宝预授权支付
  createProductOrderByPreauth:function(){
    // 支付前判断是否有签名
    if (!this.data.signature) {
      wx.showToast({
        title: '请添加您的签名',
      })
      return;
    }
    // 对于是否同意本公司租赁条款的约定
    if (this.data.isAgree != 1) {
      wx.showToast({
        title: '请阅读并同意本公司租赁条款',
        duration: 2000
      })
      return;
    }
    this.setData({
      paytype: 'preauth',
    });

    // 判断有无收获地址
    if (!this.data.addrId) {
      wx.showToast({
        title: '请添加收货地址！',
        duration: 2500
      });
      return;
    }
    this.createProductOrder();   
  },

  preauth:function(order){
    console.log(order);
    wx.redirectTo({
      url: '/pages/alipay/alipay?order_id=' + order.order_id + '&order_sn=' + order.order_sn + '&userId=' + this.data.userId + '&paytype=' + order.pay_type,
    })
  },


  // 银联预授权支付
  createProductOrderByUnionpay:function(){
    // 支付前判断是否有签名
    if (!this.data.signature) {
      wx.showToast({
        title: '请添加您的签名',
      })
      return;
    }
    // 对于是否同意本公司租赁条款的约定
    if (this.data.isAgree != 1) {
      wx.showToast({
        title: '请阅读并同意本公司租赁条款',
        duration: 2000
      })
      return;
    }
    this.setData({
      paytype: 'unionpay',
    });

    // 判断有无收获地址
    if (!this.data.addrId) {
      wx.showToast({
        title: '请添加收货地址！',
        duration: 2500
      });
      return;
    }
    this.createProductOrder();   
  },


  unionpay:function(order){
    wx.redirectTo({
      url: '/pages/alipay/alipay?order_id=' + order.order_id + '&order_sn=' + order.order_sn + '&userId=' + this.data.userId + '&paytype=' + order.pay_type,
    })
  }

});