var app = getApp();
var timeObj = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    proCat: [],
    page: 2,
    index: 2,
    brand: [],
    // 滑动
    imgUrls: [],
    kbs: [],
    lastcat: [],
    course: [],

    currentTab: 0,
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
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },


  //跳转商品列表页   
  listdetail: function (e) {
    // console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title=' + e.currentTarget.dataset.title,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
        console.log('listdetail');
      },
      complete: function () {
        // complete
      }
    })
  },
  //跳转商品搜索页  
  suo: function (e) {
    wx.navigateTo({
      url: '../search/search',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
        console.log('suo');
      },
      complete: function () {
        // complete
      }
    })
  },
  //后四个分类跳转
  other: function (e) {
    var ptype = e.currentTarget.dataset.ptype;
    var title = e.currentTarget.dataset.text;
    if (ptype == 'news') {
      wx.navigateTo({
        url: '../inf/inf'
      });
    } else if (ptype == 'jxys') {
      wx.navigateTo({
        url: '../synopsis/synopsis?title=教学优势&wedId=2'
      });
    } else if (ptype == 'xyfc') {
      wx.navigateTo({
        url: '../student_style/student_style'
      });
    } else if (ptype == 'gywm') {
      wx.navigateTo({
        url: '../synopsis/synopsis?title=关于我们&wedId=1'
      });
    }
  },

  //品牌街跳转商家详情页
  jj: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../listdetail/listdetail?brandId=' + id,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
        console.log('jj');
      },
      complete: function () {
        // complete
      }
    })
  },


  tian: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../works/works',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
        console.log('tian');
      },
      complete: function () {
        // complete
      }
    })
  },
  //点击加载更多
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getlist',
      method: 'post',
      data: { page: page },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var prolist = res.data.prolist;
        if (prolist == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page + 1,
          productData: that.data.productData.concat(prolist)
        });
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！getMore',
          duration: 2000
        });
      }
    })
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var ggtop = res.data.ggtop;
        var procat = res.data.procat;
        var prolist = res.data.prolist;
        var brand = res.data.brand;
        var course = res.data.course;

        //that.initProductData(data);
        that.setData({
          imgUrls: ggtop,
          proCat: procat,
          productData: prolist,
          brand: brand,
          course: course
        });
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！onLoad',
          duration: 2000
        });
      },
    })

    that.isUpdate();

  },

  isUpdate:function(){
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },


  // 图片的高度
  bindToImageLoad: function (e) {
    var that = this;
    wx.getSystemInfo({
      success: function (a) {
        var n = e.detail.width / e.detail.height;
        that.setData({
          viewHeight: a.windowWidth / n
        });
      }
    });
  },

  // 跳转到分类页面
  jumpClass: function () {
    wx.switchTab({
      url: '/pages/classify/classify',
    })
  },

  onShareAppMessage: function () {
    return {
      title: '盛嘉菲租赁',
      imageUrl:"https://www.sjfpro.com/shop/wechat_shop1/Data/UploadFiles/adv/20170524/1495589027693993.jpg?imageView2/1/w/750/h/320",
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

})