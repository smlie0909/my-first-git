//index.js
const app = getApp(); 
const util = require('../../utils/util.js')
const DES3 = require('../../utils/DES3.min.js').des;
const bannnerUrl = require('../../config').bannerList;
Page({
  data: { 
        imgDefault: '../../images/loading2.png',
        arr: [],
        arrHeight: [],
        itemHeight: 0,
        bannerData: {}, //banner轮播图
        newsData:[],    //帖子列表
        pageIndex: 1, //页码
        totalpage: "", //总页数
        pagesize: 20,      //返回数据的个数  
        hasMore: true,  //"上拉加载"的变量，默认true，显示; “没有数据”的变量，false，隐藏
        
    },
    onLoad: function () {
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        this.requestBannerDate();
        this.requestNewslistDate();
    },
    onReady: function () {
        setTimeout(() => {
            this.getRect();
        }, 2000)
    },
    getRect: function () {
        let that = this;
        wx.createSelectorQuery().select('.photo').boundingClientRect(function (rect) {
            if(rect == null){

            }else{
                // console.log(rect)
                that.setData({
                    itemHeight: rect.height
                })
                that.init(rect.height)
            }
        }).exec()
    },
    init: function (itemHeight) {
        let index = parseFloat(app.globalData.windowHeight / itemHeight);
        for (let i = 0; i < index * 2; i++) {
            this.data.arr[i] = true;
        }
        this.setData({ arr: this.data.arr });
        for (let i = 0; i < this.data.arr.length; i++) {
            this.data.arrHeight[i] = Math.floor(i / 2) * (itemHeight + 10);
        }
    },
    onPageScroll: function (e) {
        for (let i = 0; i < this.data.arrHeight.length; i++) {
            if (this.data.arrHeight[i] < e.scrollTop + app.globalData.windowHeight) {
                if (this.data.arr[i] === false) {
                    this.data.arr[i] = true;
                }
            }
        }
        this.setData({ arr: this.data.arr });
    },
    //事件处理函数
    jumpDetails: function (event) {
        // console.log(event)
        let itemId = event.currentTarget.dataset.tid
        let itemType = event.currentTarget.dataset.type
        let itemName = event.currentTarget.dataset.details;
        if (itemType == 1){
            wx.navigateTo({
                url: '/pages/webDetails/webDetails?tid=' + itemId
            })
        }else if (itemType == 3){
            wx.navigateTo({
                url: '/pages/webView/webView?tid=' + itemId
            })
        } else if (itemType == 2){
            wx.navigateTo({
                url: '/pages/details/details?tid=' + itemId + '&type=' + itemType + '&details=' + itemName
            })
        }else{
            return
        }
    },
    // 上拉刷新回调接口
    onReachBottom: function () {
        this.setData({
            pageIndex: this.data.pageIndex + 1, //每次下拉到底部触发 pageIndex+1
        })
        this.requestNewslistDate();
    },
    // 下拉刷新回调接口
    onPullDownRefresh: function () {
        let that = this
        this.setData({
            pageIndex:  1,
        })
        let dir = '{"page":"' + that.data.pageIndex + '"}';
        util.api_call("homelist&pool_status=1&", dir, res => {
            // console.log(res)
            if (res.content_lists == '' || res.total_page == 1) {
                that.setData({
                    hasMore: false, //无数据时提示没有更多数据
                });
            } else {
                that.setData({
                    newsData:res.content_lists,
                    totalpage: res.total_page
                })
                that.judgeData(res.total_page)
            }
        })
        wx.stopPullDownRefresh(); //停止下拉刷新
    },
    // Banner列表
    requestBannerDate :function(){
        let that = this;
        let dir = '{"access_token":"' + app.globalData.access_token +'"}';
        let params = DES3.encrypt(app.globalData.key, dir)
        wx.request({
            url: bannnerUrl,
            header: {
                'content-type': 'application/json'
            },
            data: params,
            method:"POST",
            success: function (res) {
                // console.log(JSON.parse(DES3.decrypt(app.globalData.key, res.data)))
                that.setData({
                    bannerData: JSON.parse(DES3.decrypt(app.globalData.key, res.data)).position_list[0].ad_list,
                })
            }
        })
    },
    // 帖子列表
    requestNewslistDate: function(){
        let that = this;
        let dir = '{"page":"' + that.data.pageIndex + '"}';
        util.api_call("homelist&pool_status=1", dir, res => {
            // console.log(res)
            if (res.content_lists == '' || res.total_page == 1){
                that.setData({
                    hasMore: false, //无数据时提示没有更多数据
                });
            }else{
                that.setData({
                    newsData: that.data.newsData.concat(res.content_lists),
                    totalpage: res.total_page
                })
                that.judgeData(res.total_page)
                for (let i = 0; i < res.content_lists.length; i++) {
                    that.data.arr.push(false);
                }
            }
        })
    },
    // 无数据时提示
    judgeData: function (res) {
        if (this.data.pageIndex == res) {
            this.setData({
                hasMore: false, //无数据时提示没有更多数据
            })
        }
    },
    onShareAppMessage: function () {
        let that = this
        return {
            title: that.data.title,
            path: '/pages/index/index',
        }
    }
})
