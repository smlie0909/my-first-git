const app = getApp()
const util = require('../../utils/util.js')
Page({
    data: {
        imgDefault: '../../images/loading2.png',
        arr: [],
        arrHeight: [],
        itemHeight: 0,
        domain: app.globalData.domain,//域名
        topicsData: [],    //帖子列表
        pageIndex: 1, //页码
        totalpage: "", //总页数
        hasMore: true,  //"上拉加载"的变量，默认true，显示; “没有数据”的变量，false，隐藏
    },
    onLoad: function (option) {
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        wx.setNavigationBarTitle({
            title: option.title//页面标题为路由参数
        })
        this.setData({
            pageIndex: 1, //每次进入页面将pageIndex设置为1，覆盖之前的值
        })
        if (!app.globalData.userInfo) {
            app.globalData.userInfo = "";
            this.requestTopiclistDate()
        } else {
            this.requestTopiclistDate()
        }
    },
    onReady: function () {
        setTimeout(() => {
            this.getRect();
        }, 2000)
    },
    getRect: function () {
        let that = this;
        wx.createSelectorQuery().select('.speak-img').boundingClientRect(function (rect) {
            if(rect == null){

            }else{
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
    //帖子详情
    jumpDetails: function (event) {
        let itemId = event.currentTarget.id;
        let itemName = event.currentTarget.dataset.details;
        wx.navigateTo({
            url: '/pages/details/details?tid=' + itemId + '&details=' + itemName
        })
    },
    // 上拉刷新回调接口
    onReachBottom: function () {
        let that = this;
        this.setData({
            pageIndex: this.data.pageIndex + 1, //每次下拉到底部触发 pageIndex+1
        })
        that.requestTopiclistDate();
    },
    // 下拉刷新回调接口
    onPullDownRefresh: function () {
        let that = this
        let dir = '{"auth":"' + app.globalData.userInfo.auth + '","page":"' + 1 + '","tname":"' + that.options.title + '","tid":"' + that.options.id + '","version":"4"}';
        util.api_massage("topic/get_topic_detail", dir, res => {
            // console.log(res)
            that.setData({
                detailimg: res.detailimg,
                title: res.title,
                involcount: res.involcount,
                piccount: res.piccount,
                part_ava: res.part_avatars,
                topicsData: res.post_info,
                totalpage: res.posts_totalpage,
            });
            wx.stopPullDownRefresh(); //停止下拉刷新
            if (that.data.pageIndex == that.data.totalpage) { //当pageIndex小于page页数时加载数据 
                that.setData({
                    hasMore: false, //无数据时提示没有更多数据
                })
            }
        }, res => {
            wx.hideNavigationBarLoading();
        }, () => {
            wx.hideNavigationBarLoading();
        })
    },
    // 帖子详情
    requestTopiclistDate:function(){
        let that = this;
        let dir = '{"auth":"' + app.globalData.userInfo.auth + '","page":"' + that.data.pageIndex + '","tname":"' + that.options.title + '","tid":"' + that.options.id +'","version":"4"}';
        util.api_massage("topic/get_topic_detail", dir, res => {
            // console.log(res)
            that.setData({
                detailimg: res.detailimg,
                title: res.title,
                involcount: res.involcount,
                piccount: res.piccount,
                part_ava: res.part_avatars,
                topicsData: that.data.topicsData.concat(res.post_info),
                totalpage: res.posts_totalpage,
            });
            if (that.data.pageIndex == that.data.totalpage) { //当pageIndex小于page页数时加载数据 
                that.setData({
                    hasMore: false, //无数据时提示没有更多数据
                })
            }
        }, res => {
            wx.hideNavigationBarLoading();
        }, () => {
            wx.hideNavigationBarLoading();
        })
    },
    // 点赞
    like: function (e) {
        // console.log(e)
        let comid = e.currentTarget.dataset.id
        let that = this;
        if (app.globalData.userInfo.auth){
            let dir = '{"auth":"' + app.globalData.userInfo.auth + '","postid":"' + comid + '","to_uid":"' + e.currentTarget.dataset.uid + '"}';
            util.api_massage("post/like_kh", dir, res => {
                let tmp = this.data.topicsData.map(function (arr, index) {
                    if (comid == arr.id) {
                        if (arr.praid == 0) {
                            arr.praid = 1;
                            arr.praiselist.unshift(app.globalData.userInfo.uid)
                            arr.likecount++;
                            wx.showToast({
                                title: "点赞成功",
                            })
                        } else {
                            wx.showToast({
                                title: "您已赞过了",
                            })
                        }
                    }
                    return arr;
                })
                that.setData({ topicsData: tmp });
            }, null, null)
        }else{
            wx.showToast({
                title: "请先登录",
                icon: 'success',
                duration: 1500
            });
        }
    },
});