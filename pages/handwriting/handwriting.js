import Handwriting from '../../components/handwriting/handwriting.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectColor: 'black',
    slideValue: 50,
    cartId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.handwriting = new Handwriting(this, {
      lineColor: this.data.lineColor,
      slideValue: this.data.slideValue, // 0, 25, 50, 75, 100
    })

    // 接收Pay.js传过来的购物车数据
    var that = this;
    that.setData({
      cartId:options.cartId
    })
  },

  // 选择画笔颜色
  selectColorEvent(event) {
    var color = event.currentTarget.dataset.colorValue;
    var colorSelected = event.currentTarget.dataset.color;
    this.setData({
      selectColor: colorSelected
    })
    this.handwriting.selectColorEvent(color)
  },
  retDraw() {
    this.handwriting.retDraw()
  },
  // 笔迹粗细滑块
  onTouchStart(event) {
    this.startY = event.touches[0].clientY;
    this.startValue = this.format(this.data.slideValue)
  },
  onTouchMove(event) {
    const touch = event.touches[0];
    this.deltaY = touch.clientY - this.startY;
    this.updateValue(this.startValue + this.deltaY);
  },
  onTouchEnd() {
    this.updateValue(this.data.slideValue, true);
  },
  updateValue(slideValue, end) {
    slideValue = this.format(slideValue);
    this.setData({
      slideValue,
    });
    this.handwriting.selectSlideValue(this.data.slideValue)
  },
  format(value) {
    return Math.round(Math.max(0, Math.min(value, 100)) / 25) * 25;
  },

  // 保存用户签名
  subCanvas() {
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 1000,                     //画布宽高
      height: 2000,
      destWidth: 1000,                 //画布宽高*dpr 以iphone6为准
      destHeight: 2000,                 
      canvasId: this.handwriting.canvasName,
      success: function (res) {
        console.log(res.tempFilePath) //生成的临时图片路径
        // 存服务器
        that.saveToServer(res.tempFilePath);


        // 保存到用户手机相册
        // wx.getSetting({
        //   success: (e) => {
        //     if (e.authSetting['scope.writePhotosAlbum']) {
        //       that.saveImg(res.tempFilePath);
        //     } else {
        //       wx.authorize({
        //         scope: 'scope.writePhotosAlbum',
        //         success: function (e) {
        //           that.saveImg(res.tempFilePath);
        //           wx.redirectTo({
        //             url: '/pages/order/pay?cartId=' + that.data.cartId,
        //           })
        //         },
        //         fail: function (e) {
        //           console.log(e);
        //           console.log('用户授权相册失败');
        //           wx.redirectTo({
        //             url: '/pages/order/pay?cartId=' + that.data.cartId,
        //           })
        //         }
        //       })
        //     }
        //   }
        // })

      }
    })

  },

  // 保存相册
  saveImg(path){
    // 保存到用户手机相册
    wx.saveImageToPhotosAlbum({
      filePath: path,
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          duration:200
        })
      }
    })
  },

  // 存服务器
  saveToServer(path){
    var that = this
    wx.uploadFile({
      url: app.d.ceshiUrl + '/api/signature/index',
      filePath: path,
      name: 'signature',
      formData: {
        uid: app.d.userId
      },
      success: function (e) {
        console.log(e);
        console.log(e.data.status);
        if(e.data.status == 0){
          wx.showToast({
            title: '生成签名失败',
            duration: 200
          })
        }else{
          wx.redirectTo({
            url: '/pages/order/pay?cartId=' + that.data.cartId,
          })
        }
      }
    })
  }

})