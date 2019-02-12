//index.js  
//获取应用实例  
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  firstIndex: -1,
  data: {
    bannerApp: true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //tab切换  
    productId: 0,
    itemData: {},
    messages:'',
    bannerItem: [],
    buynum: 3,
    buynumber: 1,
    // 产品图片轮播
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // 属性选择
    firstIndex: -1,
    //准备数据
    //数据结构：以一组一组来进行设定
    commodityAttr: [],
    attrValueList: [],
    //设置租赁有效期
    stime: '',
    etime:'',
    confirmType: '',
    // 用户是否认证
    isCertify:app.globalData.userInfo['isCertify'],
    freedepositNum: app.globalData.userInfo['freedepositNum'],
    shareTitle:''
  },

  // 弹窗
  setModalStatus: function (e) {


    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step();

    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalStatus: true,
          confirmType: 'buynow'

        }
      );
    }
    if (e.currentTarget.dataset.status == 2) {

      this.setData(
        {
          showModalStatus: true,
          confirmType: 'addcart'

        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // console.log(this.data.confirmType)

  },
  // 修改租赁天数
  changeNum: function (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
      if (this.data.buynum <= 1) {
        buynum: 1
        fee: this.data.itemData.price_yh * this.data.buynumber
      } else {
        this.setData({
          buynum: this.data.buynum - 1,
          fee: (this.data.buynum - 1) * this.data.itemData.price_yh * this.data.buynumber

        })
      };
    } else {
      this.setData({
        buynum: this.data.buynum + 1,
        fee: (this.data.buynum + 1) * this.data.itemData.price_yh * this.data.buynumber,
      })
    };
  },
  //修改设备数量
  changeNum1: function (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
      if (this.data.buynumber <= 1) {
        buynumber: 1
        fee: this.data.itemData.price_yh
      } else {
        this.setData({
          buynumber: this.data.buynumber - 1,
          fee: this.data.buynum * this.data.itemData.price_yh * (this.data.buynumber - 1)

        })
      };
    } else {
      this.setData({
        buynumber: this.data.buynumber + 1,
        fee: this.data.buynum * this.data.itemData.price_yh * (this.data.buynumber + 1),
      })
    };
  },

  // 传值
  onLoad: function (option) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        loadingHidden: true
      })
    });

    //this.initNavHeight();
    var that = this;
    //获取有效期
    var curDate = new Date();
    var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000); //后一天
    var nextMonth = new Date(curDate.getTime() + 30 *24 * 60 * 60 * 1000); //一个月
    var st = nextDate.getFullYear() + '-' + (nextDate.getMonth() + 1) + '-' + nextDate.getDate();
    var et = nextMonth.getFullYear() + '-' + (nextMonth.getMonth() + 1) + '-' + nextMonth.getDate();
    that.setData({
      productId: option.productId,
      stime: st,
      etime: et
    });

    that.loadProductDetail();

  },

  //时间改变
  bindDateChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      stime: e.detail.value
    })
  },
  // 商品详情数据获取
  loadProductDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/index',
      method: 'post',
      data: {
        uid: app.d.userId,
        pro_id: that.data.productId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if (status == 1) {
          // console.log(res);
          var pro = res.data.pro;
          var content = pro.content;
          var messages = Object.keys(pro).length;
          //that.initProductData(data);
          WxParse.wxParse('content', 'html', content, that, 3);
          that.setData({
            shareTitle:pro.name,
            itemData: pro,
            messages: messages,
            bannerItem: pro.img_arr,
            commodityAttr: res.data.commodityAttr,
            attrValueList: res.data.attrValueList,
          });
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
            icon:'none',
            success:function(){
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }, 2000)
            
            }
          });
        
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  // 属性选择
  onShow: function () {

    this.setData({
      includeGroup: this.data.commodityAttr
    });
    this.distachAttrValue(this.data.commodityAttr);
    // 只有一个属性组合的时候默认选中
    // console.log(this.data.attrValueList);
    if (this.data.commodityAttr.length == 1) {
      for (var i = 0; i < this.data.commodityAttr[0].attrValueList.length; i++) {
        this.data.attrValueList[i].selectedValue = this.data.commodityAttr[0].attrValueList[i].attrValue;
      }
      this.setData({
        attrValueList: this.data.attrValueList
      });
    }
  },
  /* 获取数据 */
  distachAttrValue: function (commodityAttr) {
    /**
      将后台返回的数据组合成类似
      {
        attrKey:'型号',
        attrValueList:['1','2','3']
      }
    */
    // 把数据对象的数据（视图使用），写到局部内
    var attrValueList = this.data.attrValueList;
    // 遍历获取的数据
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
        // console.log('属性索引', attrIndex); 
        // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置
        if (attrIndex >= 0) {
          // 如果属性值数组中没有该值，push新值；否则不处理
          if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
            attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
          }
        } else {
          attrValueList.push({
            attrKey: commodityAttr[i].attrValueList[j].attrKey,
            attrValues: [commodityAttr[i].attrValueList[j].attrValue]
          });
        }
      }
    }
    // console.log('result', attrValueList)
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList: attrValueList
    });
  },
  getAttrIndex: function (attrName, attrValueList) {
    // 判断数组中的attrKey是否有该属性值
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < attrValueList.length ? i : -1;
  },
  isValueExist: function (value, valueArr) {
    // 判断是否已有属性值
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    /*
    点选属性值，联动判断其他属性值是否可选
    {
      attrKey:'型号',
      attrValueList:['1','2','3'],
      selectedValue:'1',
      attrValueStatus:[true,true,true]
    }
    console.log(e.currentTarget.dataset);
    */
    var attrValueList = this.data.attrValueList;
    var index = e.currentTarget.dataset.index;//属性索引
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
      if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
        // 取消选中
        this.disSelectValue(attrValueList, index, key, value);
      } else {
        // 选中
        this.selectValue(attrValueList, index, key, value);
      }

    }
  },
  /* 选中 */
  selectValue: function (attrValueList, index, key, value, unselectStatus) {
    // console.log('firstIndex', this.data.firstIndex);
    var includeGroup = [];
    if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选
      var commodityAttr = this.data.commodityAttr;
      // 其他选中的属性值全都置空
      // console.log('其他选中的属性值全都置空', index, this.data.firstIndex, !unselectStatus);
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          attrValueList[i].selectedValue = '';
        }
      }
    } else {
      var commodityAttr = this.data.includeGroup;
    }

    // console.log('选中', commodityAttr, index, key, value);
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        if (commodityAttr[i].attrValueList[j].attrKey == key && commodityAttr[i].attrValueList[j].attrValue == value) {
          includeGroup.push(commodityAttr[i]);
        }
      }
    }
    attrValueList[index].selectedValue = value;

    // 判断属性是否可选
    // for (var i = 0; i < attrValueList.length; i++) {
    //   for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
    //     attrValueList[i].attrValueStatus[j] = false;
    //   }
    // }
    // for (var k = 0; k < attrValueList.length; k++) {
    //   for (var i = 0; i < includeGroup.length; i++) {
    //     for (var j = 0; j < includeGroup[i].attrValueList.length; j++) {
    //       if (attrValueList[k].attrKey == includeGroup[i].attrValueList[j].attrKey) {
    //         for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
    //           if (attrValueList[k].attrValues[m] == includeGroup[i].attrValueList[j].attrValue) {
    //             attrValueList[k].attrValueStatus[m] = true;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // console.log('结果', attrValueList);
    this.setData({
      attrValueList: attrValueList,
      includeGroup: includeGroup
    });

    var count = 0;
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].selectedValue) {
          count++;
          break;
        }
      }
    }
    if (count < 2) {// 第一次选中，同属性的值都可选
      this.setData({
        firstIndex: index
      });
    } else {
      this.setData({
        firstIndex: -1
      });
    }
  },
  /* 取消选中 */
  disSelectValue: function (attrValueList, index, key, value) {
    var commodityAttr = this.data.commodityAttr;
    attrValueList[index].selectedValue = '';

    // 判断属性是否可选
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = true;
      }
    }
    this.setData({
      includeGroup: commodityAttr,
      attrValueList: attrValueList
    });

    for (var i = 0; i < attrValueList.length; i++) {
      if (attrValueList[i].selectedValue) {
        this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
      }
    }
  },

  initProductData: function (data) {
    data["LunBoProductImageUrl"] = [];

    var imgs = data.LunBoProductImage.split(';');
    for (let url of imgs) {
      url && data["LunBoProductImageUrl"].push(app.d.hostImg + url);
    }

    data.Price = data.Price / 100;
    data.VedioImagePath = app.d.hostVideo + '/' + data.VedioImagePath;
    data.videoPath = app.d.hostVideo + '/' + data.videoPath;
  },

  //添加到收藏
  addFavorites: function (e) {
    // app.isLogin();
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/col',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: that.data.productId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data      
        var data = res.data;
        if (data.status == 1) {
          if (data.collect == 1){
            that.setData({
              ['itemData.collect']: 1
            })
          } else if (data.collect == 2) {
            that.setData({
              ['itemData.collect']: 0
            })
          }
          wx.showToast({
            title: '操作成功！',
            duration: 2000
          });
          //变成已收藏，但是目前小程序可能不能改变图片，只能改样式
          // that.data.itemData.isCollect = true;
        } else {
          if (!app.d.userId) {
            wx.navigateTo({
              url: '/pages/certify/certify',
            })
          }
          wx.showToast({
            title: data.err,
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

  
  //添加到购物车
  addShopCart: function (e) { 
    var that = this;
    // ****************
    var ptype = e.currentTarget.dataset.type;
    // 如果用户登录了  并且是未认证的状态 并且不是会员
    if (JSON.stringify(app.globalData.userInfo) != "{}" && app.globalData.userInfo['user_rank'] != 1 && (app.globalData.isCertify == 0 || app.globalData.userInfo['isCertify'] == 0)){
      wx.showModal({
        title: '实名认证可减免押金',
        content: '是否需要减免押金？',
        success:function(res){
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/freelimit/freelimit',
            })
          } else if (res.cancel) {
            
            console.log('用户拒绝认证，加入购物车'); 
              // 这里:如果不在wx.showModal之外声明var that = this;这边是拿不到that.data的数据的
              // 可见 var that = this; 还是有必要的       
              // 用户拒绝认证，加入购物车
              that.addCart(ptype);
          }
        }
      })
    }else{
      // 用户已经认证了
      that.addCart(ptype);
    }

  },
  // 加入购物车
  addCart(ptype){
    var that = this
    // 用户已经认证了
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/add',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: that.data.productId,
        num: that.data.buynum,
        buynumber: that.data.buynumber,
        stime: that.data.stime
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data    
        var data = res.data;
        if (data.status == 1) {

          if (ptype == 'buynow') {
            wx.redirectTo({
              url: '../order/pay?cartId=' + data.cart_id
            });
            return;
          } else if (ptype == 'addcart') {
            wx.showToast({
              title: '加入购物车成功',
              icon: 'success',
              duration: 2000
            });
            that.setData({
              showModalStatus: false
            });
          }
        } else {
          if (!app.d.userId) {
            wx.navigateTo({
              url: '/pages/certify/certify',
            })
          }
          wx.showToast({
            title: data.err,
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
  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  initNavHeight: function () {////获取系统信息
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
  bannerClosed: function () {
    this.setData({
      bannerApp: false,
    })
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },


  onUnload:function(){
    // var page = getCurrentPages().pop();
    // if(getCurrentPages()[0].route() == '/pages/product/detail'){
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   })
    // }

    // if(this.data.productId){
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   })
    // }
  },

  onShareAppMessage: function () {
    return {
      title: this.data.shareTitle,
      path: '/pages/product/detail?productId=' + this.data.productId,
      success: function (res) {
        // 分享成功
        console.log('Yes');
      },
      fail: function (res) {
        // 分享失败
        console.log('Fail');
      }
    }
  },
});
