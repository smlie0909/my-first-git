// pages/webDetails/webDetails.js
const app = getApp()
const APIURL = require('../../config.js').API_URL
Page({

  /**
   * 页面的初始数据
   */
    web_url:"",
    data: {
        src: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo){
            this.setData({
                src: APIURL + "viewthread&tid=" + options.tid + "&uid=" + options.uid+"&ishtml=1&mini=1&auth=" +encodeURIComponent(app.globalData.userInfo.auth)
            })
        }else{
            this.setData({
                src: APIURL + "viewthread&tid=" + options.tid + "&uid=" + options.uid +"&ishtml=1&mini=1"
            })
        }
    },
    onShareAppMessage: function (options) {
        let that = this
        let return_url = options.webViewUrl
        console.log(options.webViewUrl)
        let path = '/pages/webDetails/webDetails?return_url=' + encodeURIComponent(return_url)
        return {
            title: that.data.title,
            path: path,
            success: function (res) {
                that.web_url = return_url
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }

    }
})