// pages/editaddr/editaddr.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    pages:'',
    orderId:'',
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shiArr: [],//城市数组
    shiId: [],//城市id数组
    quArr: [],//区数组
    shengIndex: 0,
    shiIndex: 0,
    quIndex: 0,
    mid: 0,
    sheng: 0,
    city: 0,
    area: 0,
    code: 0,
    addrId: 0,
    shengName:'',
    shiName: '',
    quName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    var addr = JSON.parse(options.addr);
    that.setData({
      address: addr,
      pages: options.pages,
      orderId: options.orderId ? options.orderId:'',
      // shiIndex: addr.city,
      // quIndex: addr.quyu
    })
    //获取用户的省市区地址
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_useraddr',
      data: { 
        sheng: that.data.address.sheng,
        shi: that.data.address.city, 
        qu: that.data.address.quyu,  
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        // console.log(res);return;
        that.setData({
          shengName: res.data.sheng,
          shiName: res.data.shi,
          quName: res.data.qu
        })
        wx.request({
          url: app.d.ceshiUrl + '/Api/Address/get_province',
          data: {},
          method: 'POST',
          success: function (res) {
            var status = res.data.status;
            var province = res.data.list;
            var sArr = [];
            var sId = [];
            sArr.push('请选择');
            sId.push('0');
            for (var i = 0; i < province.length; i++) {
              sArr.push(province[i].name);
              sId.push(province[i].id);
            }
            that.setData({
              shengArr: sArr,
              shengId: sId
            })
            var sname = that.data.shengName;
            var sarr = that.data.shengArr;
            var skey = sarr.indexOf(sname);
            // console.log(sArr);
            // console.log(sname);
            // console.log(skey);
            that.setData({
              shengIndex: skey,
            })
            // return;
            //获取市级城市
            wx.request({
              url: app.d.ceshiUrl + '/Api/Address/get_city',
              data: { sheng: that.data.shengIndex },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {// 设置请求的 header
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                // success
                // console.log(res);return;
                var status = res.data.status;
                var city = res.data.city_list;
                var hArr = [];
                var hId = [];
                hArr.push('请选择');
                hId.push('0');
                for (var i = 0; i < city.length; i++) {
                  hArr.push(city[i].name);
                  hId.push(city[i].id);
                }
                that.setData({
                  sheng: res.data.sheng,
                  shiArr: hArr,
                  shiId: hId
                })
                var shiame = that.data.shiName;
                var shiarr = that.data.shiArr;
                var skey = shiarr.indexOf(shiame);
                that.setData({
                  shiIndex: skey,
                })
                //获取地区
                wx.request({
                  url: app.d.ceshiUrl + '/Api/Address/get_area',
                  data: {
                    city: that.data.shiIndex,
                    sheng: that.data.sheng
                  },
                  method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {// 设置请求的 header
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    var status = res.data.status;
                    var area = res.data.area_list;
                    var qArr = [];
                    var qId = [];
                    qArr.push('请选择');
                    qId.push('0');
                    for (var i = 0; i < area.length; i++) {
                      qArr.push(area[i].name)
                      qId.push(area[i].id)
                    }
                    that.setData({
                      city: res.data.city,
                      quArr: qArr,
                      quiId: qId
                    })
                    var quname = that.data.quName;
                    var quarr = that.data.quArr;
                    var skey = quarr.indexOf(quname);
                    that.setData({
                      quIndex: skey,
                    })
                    //获取code
                    wx.request({
                      url: app.d.ceshiUrl + '/Api/Address/get_code',
                      data: {
                        quyu: that.data.quIndex,
                        city: that.data.city
                      },
                      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: {// 设置请求的 header
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        wx.hideLoading()
                        that.setData({
                          area: res.data.area,
                          code: res.data.code
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
                  fail: function () {
                    // fail
                    wx.showToast({
                      title: '网络异常！',
                      duration: 2000
                    });
                  }
                })
              },
              fail: function () {
                // fail
                wx.showToast({
                  title: '网络异常！',
                  duration: 2000
                });
              },

            })

          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          },
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    //获取省级城市
   
  },
  bindPickerChangeshengArr: function (e) {
    this.setData({
      shengIndex: e.detail.value,
      shiArr: [],
      shiId: [],
      quArr: [],
      quiId: []
    });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_city',
      data: { sheng: e.detail.value },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        // return;
        var status = res.data.status;
        var city = res.data.city_list;
        var hArr = [];
        var hId = [];
        hArr.push('请选择');
        hId.push('0');
        for (var i = 0; i < city.length; i++) {
          hArr.push(city[i].name);
          hId.push(city[i].id);
        }
        that.setData({
          sheng: res.data.sheng,
          shiArr: hArr,
          shiId: hId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },

    })
  },
  bindPickerChangeshiArr: function (e) {
    // console.log(e.detail.value);return;
    this.setData({
      shiIndex: e.detail.value,
      quArr: [],
      quiId: []
    })
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_area',
      data: {
        city: e.detail.value,
        sheng: this.data.sheng
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        var area = res.data.area_list;

        var qArr = [];
        var qId = [];
        qArr.push('请选择');
        qId.push('0');
        for (var i = 0; i < area.length; i++) {
          qArr.push(area[i].name)
          qId.push(area[i].id)
        }
        that.setData({
          city: res.data.city,
          quArr: qArr,
          quiId: qId
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
  bindPickerChangequArr: function (e) {
    // console.log(this.data.city)
    this.setData({
      quIndex: e.detail.value
    });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_code',
      data: {
        quyu: e.detail.value,
        city: this.data.city
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          area: res.data.area,
          code: res.data.code
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
  formSubmit: function (e) {
    var that = this
    var adds = e.detail.value;
    // console.log(orderId);return;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/edit_adds',
      data: {
        user_id: app.d.userId,
        addr_id: this.data.address.id,
        receiver: adds.name,
        tel: adds.phone,
        sheng: this.data.sheng,
        city: this.data.city,
        quyu: this.data.area,
        adds: adds.address,
        code: this.data.code,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: res.data.success,
            duration: 2000
          });
         var page = that.data.pages;
         if(page == 'address'){
           wx.redirectTo({
             url: '../address/user-address/user-address',
           })
         } else if (page == 'backgoods'){
           wx.redirectTo({
              url: '/pages/backgoods/backgoods?orderId=' + that.data.orderId,
            })
         }

        } else if (status == 2) {
          var page = that.data.pages;
          if (page == 'address') {
            wx.redirectTo({
              url: '../address/user-address/user-address',
            })
          } else if (page == 'backgoods') {
            wx.redirectTo({
              url: '/pages/backgoods/backgoods?orderId=' + that.data.orderId,
            })
          }
         } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
            icon:'none'
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
    })


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