//获取应用实例  
var app = getApp();
Page({
  data: {
    currType: 10,
    // 当前类型
    "types": [
    ],
  },

  onLoad: function (option) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/brand/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        // console.log(res);
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.list;
          var first = res.data.first;
          that.setData({
            types: list,
            typeTree:first
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
        that.setData({
          currType: 2
        });

      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },

    });
  },



  tapType: function (e) {
    var that = this;
    const currType = e.currentTarget.dataset.typeId;

    that.setData({
      currType: currType
    });
    // console.log(currType);
    wx.request({
      url: app.d.ceshiUrl + '/Api/brand/getcat',
      method: 'post',
      data: { brand_id: currType },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var brandList = res.data.brandList;
          that.setData({
            typeTree: brandList,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      }
    });
  },
  // 加载品牌、二级类目数据
  getTypeTree(currType) {
    const me = this, _data = me.data;
    if (!_data.typeTree[currType]) {
      request({
        url: ApiList.goodsTypeTree,
        data: { typeId: +currType },
        success: function (res) {
          _data.typeTree[currType] = res.data.data;
          me.setData({
            typeTree: _data.typeTree
          });
        }
      });
    }
  }
})