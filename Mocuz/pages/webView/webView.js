// pages/webView/webView.js
const app = getApp();
const webView = require('../../config').webView;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          src: webView + this.options.tid
      })
      
  },
  onShareAppMessage: function (options) {
      return {
          title: '首页',
          path: '/pages/webView/webView?tid='+this.options.tid,
      }
  }
})