var app = getApp();
// pages/cart/cart.js
Page({
  data: {
    page: 1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    total: 0,
    carts: [],
    userInfo: [],
    selectedAllStatus: false,
    uid: app.d.userId,
    isCertify:app.globalData.userInfo['isCertify'],
    freedepositNum:app.globalData.userInfo['freedepositNum'],
    user_rank: app.globalData.userInfo['rank'],
    invalid_carts:[]
  },


  bindMinus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/up_cart',
      method: 'post',
      data: {
        user_id: app.d.userId,
        num: num,
        cart_id: cart_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].num = num;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
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

  bindPlus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].num;
    // 自增
    num++;
    // console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/up_cart',
      method: 'post',
      data: {
        user_id: app.d.userId,
        num: num,
        cart_id: cart_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].num = num;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
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
  //减少购物车数量
  NumberMinus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var numb = that.data.carts[index].number;

    // 如果只有1件了，就不允许再减了
    if (numb > 1) {
      numb--;
    }
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/up_cart_number',
      method: 'post',
      data: {
        user_id: app.d.userId,
        numb: numb,
        cart_id: cart_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = numb <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].number = numb;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
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

  NumberPlus: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var numb = that.data.carts[index].number;
    // 自增
    numb++;
    // console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/up_cart_number',
      method: 'post',
      data: {
        user_id: app.d.userId,
        numb: numb,
        cart_id: cart_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = numb <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].number = numb;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
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
  bindCheckbox: function (e) {
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].selected = !selected;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts
    });
    this.sum()
  },

  bindSelectAll: function () {
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = selectedAllStatus;
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts
    });
    this.sum()
  },

  onHide: function () {
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = false;
    }
    this.setData({
      selectedAllStatus: false,
      carts: carts,
      total: 0
    });
  },

  bindCheckout: function () {
    //约束起租时间与租赁天数一致
    var arr = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        arr.push(this.data.carts[i]);
      }
    }
    //失效购物车商品不可以提交
    for (var i = 0; i < arr.length; i++) {
      var stime = new Date(arr[i].startdate);//时间转换
      var nowtime = new Date();
      if (stime < nowtime) {
        wx.showToast({
          title: '起租日期失效',
          icon: 'none'
        })
        return false;
      }
    }
    if (arr.length >= 2) {
      var day = arr[0].startdate;
      var num = arr[0].num;
      for (var i = 1; i < arr.length; i++) {
        if (arr[i].startdate != day || arr[i].num != num) {
          wx.showToast({
            title: '起租日和天数必须一致',
            icon: 'none'
          })
          return false;
        }
      }
    }
    //失效购物车商品不可以提交
    // 初始化toastStr字符串
    var toastStr = '';
    // 遍历取出已勾选的cid
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        toastStr += this.data.carts[i].id;
        toastStr += ',';
      }
    }
    if (toastStr == '') {
      wx.showToast({
        title: '请选择！',
        duration: 2000
      });
      return false;
    }
    //存回data
    wx.navigateTo({
      url: '../order/pay?cartId=' + toastStr,
    })
  },

  bindToastChange: function () {
    this.setData({
      toastHidden: true
    });
  },

  sum: function () {
    var carts = this.data.carts;
    var that = this
    //获得用户身份
    var user_rank = app.globalData.userInfo['user_rank'];
    // console.log(user_rank);
    // 计算总金额
    var total = 0;
    var price_yj = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        price_yj += Number(carts[i].price_yj) * carts[i].number;
        //如果是会员免押金
        if (user_rank == 1) {
          total += carts[i].num * carts[i].price * carts[i].number;
        } else {
          total += carts[i].num * carts[i].price * carts[i].number + Number(carts[i].price_yj) * carts[i].number;
        }
      }
    }

    // 用户已认证的话,从总价格中减去可以减免的押金
    if (that.data.isCertify == 1 && total != 0 && app.globalData.userInfo['user_rank'] != 1) {
      if (that.data.freedepositNum) {
        if (price_yj <= that.data.freedepositNum) {
          total -= price_yj;
        } else {
          total -= that.data.freedepositNum;
        }
      }
    }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: '¥ ' + total
    });
  },

  onLoad: function (options) {
    /*
    if (JSON.stringify(app.globalData.userInfo) == "{}") {
      wx.navigateTo({
        url: '/pages/certify/certify',
      })
    }else{
      this.loadProductData();
      this.sum();
    }
    */
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        orderInfo: app.globalData.order,
        carts: app.globalData.carts,
        loadingHidden: true
      })
    });



    // that.loadProductData();


  },

  onShow: function () {

    /*
    if (JSON.stringify(app.globalData.userInfo) == "{}" && app.globalData.flag == 5) {
      app.globalData.flag = null;
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (JSON.stringify(app.globalData.userInfo) == "{}"){
      wx.navigateTo({
        url: '/pages/certify/certify',
      })
    }else{
      this.loadProductData();
    }
    */
    var that = this
    that.loadProductData();
    that.isCertify();
  },

  isCertify(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/api/zhimo/iscertify',
      method: 'post',
      data: {
        userId: app.d.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res);
        that.setData({
          isCertify: res.data.isCertify,
          freedepositNum: res.data.freedepositNum,
          user_rank:res.data.rank
        });
        app.globalData.userInfo['isCertify'] = res.data.isCertify;
        app.globalData.userInfo['freedepositNum'] = res.data.freedepositNum;
        app.globalData.userInfo['user_rank'] = res.data.rank;
      }
    })
  },

  removeShopCard: function (e) {
    var that = this;
    var cardId = e.currentTarget.dataset.cartid;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Shopping/delete',
          method: 'post',
          data: {
            cart_id: cardId,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            if (data.status == 1) {
              //that.data.productData.length =0;
              that.loadProductData();
            } else {
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
            }
          },
        });
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
  removeInvalid: function (e) {
    var that = this;
    var deltype = e.currentTarget.dataset.type;
    var invalid =that.data.invalid_carts;
    var carts_id = '';
    for (var i = 0; i < invalid.length; i++) {
      carts_id += invalid[i]['id']+ ',';
    }
    wx.showModal({
      title: '提示',
      content: '确认清空失效物品吗？',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Shopping/delete',
          method: 'post',
          data: {
            deltype: deltype,
            carts: carts_id,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            if (data.status == 1) {
              //that.data.productData.length =0;
              that.loadProductData();
            } else {
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
            }
          },
        });
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

  // 数据案例
  loadProductData: function () {
    // var that = this;
    // wx.request({
    //   url: app.d.ceshiUrl + '/Api/Shopping/index',
    //   method:'post',
    //   data: {
    //     user_id: app.d.userId
    //   },
    //   header: {
    //     'Content-Type':  'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     //--init data
    //     var cart = res.data.cart;
    //     // for (var i = 0; i < cart.length;i++){
    //     //   cart[i]['startdate'] = cart[i]['startdate'].slice(0,10); 
    //     // }
    //     that.setData({
    //       carts:cart,
    //     });
    //     // 更新是否认证
    //     that.setData({
    //       isCertify: app.globalData.isCertify,
    //       freedepositNum: app.globalData.freedepositNum
    //     })
    //     //endInitData
    //   },
    // });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/index',
      method: 'post',
      data: {
        user_id: app.d.userId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res)
        //--init data
        var cart = res.data.cart;
        var invalid = [];
        for (var i = 0; i < cart.length; i++) {
          cart[i]['startdate'] = cart[i]['startdate'].slice(0, 10);
          var starttime = new Date(cart[i]['startdate']);
          var time  = new Date();
          if(time >= starttime){
            invalid.push(cart[i]);
            cart.splice(i, 1);
            i = i - 1; 
          } 
        }
        that.setData({
          carts: cart,
          invalid_carts: invalid
        })
        //endInitData
      },
    });

  },

})