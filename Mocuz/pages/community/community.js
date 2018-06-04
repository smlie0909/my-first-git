//获取应用实例 
const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
        currentTab: 0,
        IconData:{},    //版块数据
        datelineList: [], //放置最新发帖的数组 
        hotList: [], //放置本地爆料的数组 
        lastpostList: [], //放置最新回复的数组 
        pageIndex: 1,    //页码
        totalpage: "", //总页数 
        hasMore: true,  //"上拉加载"的变量，默认true，显示; “没有数据”的变量，false，隐藏
        init:'dateline',
        navbar: [
            { navtitle: '最新发帖', parameter:'dateline'}, 
            // { navtitle: '本周顶帖榜', parameter: 'hot' }, 
            { navtitle: '最新回复', parameter: 'lastpost'}
        ],
    },
    onLoad: function () {
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        this.requestsectionIconDate();
        this.requestsectionListDate();
    },
    onShow:function(){
        let that = this
        // 解决发布帖子刷新的问题
        wx.getStorage({
            key: 'keypagetype',
            success: function (res) {
                if (res.data == "community"){
                    that.initList();
                }
                wx.removeStorageSync('keypagetype');
            }
        })
    },
    //事件处理函数
    jumpTemplate: function (event) {
        let itemId = event.currentTarget.id;
        let name = event.currentTarget.dataset.title
        wx.navigateTo({
            url: '/pages/blockList/blockList?id=' + itemId + '&&title=' + name,
        })
    },
    //详情
    jumpDetails: function (event) {
        let tid = event.currentTarget.dataset.tid
        let uid = event.currentTarget.dataset.uid
        let itemName = event.currentTarget.dataset.details
        wx.navigateTo({
            url: '/pages/webDetails/webDetails?tid=' + tid + '&uid=' + uid + '&details=' + itemName 
        })
    },
    jumpPost:function(event) {
        let post = event.currentTarget.dataset.post
        wx.navigateTo({
            url: '/pages/whole/whole?post=' + post
        })
    },
    //tab切换响应点击导航栏
    navbarTap: function (e) {
        this.setData({
            init: e.currentTarget.dataset.parameter,
            currentTab: e.currentTarget.dataset.idx,
            hasMore: true, //无数据时提示没有更多数据
            pageIndex: 1,    //页码
            datelineList: [], //放置最新发帖的数组 
            hotList: [], //放置本地爆料的数组 
            lastpostList: [], //放置最新回复的数组 
        })
        this.requestsectionListDate();
    },
    // 上拉刷新回调接口
    onReachBottom: function () {
        this.setData({
            pageIndex: this.data.pageIndex + 1, //每次下拉到底部触发 pageIndex+1
        })
        this.requestsectionListDate();
    },
    // 下拉刷新回调接口
    onPullDownRefresh: function () {
        this.setData({
            pageIndex: 1,
        })
        this.initList();
        wx.stopPullDownRefresh(); //停止下拉刷新
    },
    // 发布完帖子初始加载列表
    initList:function(){
        let that = this;
        that.setData({ pageIndex: 1, top: 0 });
        let dir = '{"order":"' + that.data.init + '","page":"' + that.data.pageIndex + '"}';
        util.api_call("forumindex", dir, res => {
            // console.log(res)
            if (res.order == "dateline") {
                that.setData({
                    datelineList: res.list,
                    totalpage: res.total,
                });
                that.judgeData(res.total)
            }else if (res.order == "lastpost") {
                that.setData({
                    lastpostList: res.list,
                    totalpage: res.total,
                });
                that.judgeData(res.total)
            } else if (res.order == "hot") {
                that.setData({
                    hotList: res.list,
                    totalpage: res.total,
                });
                that.judgeData(res.total)
            }
        },null,null)
    },
    //版块列表加载
    requestsectionIconDate: function () {
        let that = this;
        util.api_call("bootstart4", null, res => {
            // console.log(res)
            that.setData({
                IconData: res.blocklist,
            })
        }, null, null)
    },
    //话题列表加载
    requestsectionListDate: function () {
        let that = this;
        let dir = '{"order":"' + that.data.init +'","page":"' + that.data.pageIndex + '"}';  
        util.api_call("forumindex", dir, res => {
            // console.log(res)
            if(res.list ==''){
                this.setData({
                    hasMore: false, //无数据时提示没有更多数据
                })
            }else{
                that.judgeType(res)
            }
            
        }, null,null)
    },
    judgeType:function(res){
        let that = this
        if (res.order == "dateline") {
            that.setData({
                datelineList: that.data.datelineList.concat(res.list),
                totalpage: res.total,
            });
            that.judgeData(res.total)
        }else if (res.order == "lastpost") {
            that.setData({
                lastpostList: that.data.lastpostList.concat(res.list),
                totalpage: res.total,
            });
            that.judgeData(res.total)
        } else if (res.order == "hot") {
            that.setData({
                hotList: that.data.hotList.concat(res.list),
                totalpage: res.total,
            });
            that.judgeData(res.total)
        }
    },
    // 无数据时提示
    judgeData:function(res){
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
            path: '/pages/community/community',
        }
    }
}) 