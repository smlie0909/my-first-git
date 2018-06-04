// pages/topicList/topicList.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
    data:{
        pageIndex: 1, //页码
        totalpage: "", //总页数
        hasMore: true,  //"上拉加载"的变量，默认true，显示; “没有数据”的变量，false，隐藏
        topicsList:[]
    },
    onLoad: function (options) {
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: true,
        });
        this.requestTopic()
    },
    requestTopic:function(){
        let that = this;
        if (app.globalData.userInfo){
            let dir = '{"auth":"' + app.globalData.userInfo.auth + '","op":"index","page":"' + that.data.pageIndex + '"}';
            util.api_massage("topic/topic_list", dir, res => {
                // console.log(res)
                that.setData({
                    topicsList: that.data.topicsList.concat(res.isrectopic),
                    totalpage: res.totalpage,
                })
                if (this.data.pageIndex == res.totalpage) {
                    this.setData({
                        hasMore: false, //无数据时提示没有更多数据
                    })
                }
            }, res => {
                wx.hideNavigationBarLoading();
            }, () => {
                wx.hideNavigationBarLoading();
            })
        }else{
            wx.showToast({
                title: "请先登录",
                icon: 'success',
                duration: 1500
            });
        }
    },
    selectTopics:function(event){
        let itemId = event.currentTarget.id;
        let itemName = event.currentTarget.dataset.title;
        wx.setStorage({//记录发帖页面状态
            key: "keyTopic",
            data: itemName
        })
        wx.navigateBack({})
    }
})