const app = getApp();
const util = require('../../utils/util.js')
Page({
    data:{
        myPostList:[],
        pageIndex: 1, //页码
        totalpage: "", //总页数
        hasMore: true,  //"上拉加载"的变量，默认true，显示; “没有数据”的变量，false，隐藏
    },
    onLoad:function(){
        // console.log(this.options)
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        wx.setNavigationBarTitle({
            title: this.options.title//页面标题为路由参数
        });
        this.setData({
            page:this.options.page,
        });

        if (app.globalData.userInfo) {
            if (this.options.page == "community"){
                this.setData({ pagetype: this.options.page})
                this.my_tracks();
            }else{
                this.setData({ pagetype: this.options.page })
                this.my_friends();
            }
        }
        
    },
    onShow:function(){
        this.setData({
            pageIndex: 1,
        });
    },
    //事件处理函数
    jumpDetails: function (event) {
        // console.log(event)
        let tid = ''
        let uid = event.currentTarget.dataset.uid
        let itemName = ''
        let gender = app.globalData.userInfo.gender
        if (this.options.page == "community"){
            tid = event.currentTarget.dataset.tid
            itemName = event.currentTarget.dataset.details
            wx.navigateTo({
                url: '/pages/webDetails/webDetails?tid=' + tid + '&uid=' + uid + '&details=' + itemName + '&gender=' + gender
            })
        }else{
            itemName = 'local'
            tid = event.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/details/details?tid=' + tid + '&uid=' + uid + '&details=' + itemName + '&gender=' + gender
            })
        }
        
        
    },
    //加载更多
    lower: function () {
        let that = this;
        this.setData({
            pageIndex: this.data.pageIndex + 1, //每次下拉到底部触发 pageIndex+1
        })
        if (this.options.page == "community"){
            this.my_tracks()
        }else{
            this.my_friends()
        }
    },
    //我的帖子
    my_tracks:function(){
        let that = this
        let dir = '{"auth":"' + app.globalData.userInfo.auth + '","type":"thread","page":"'+ that.data.pageIndex +'"}';
        util.api_call("my_tracks", dir, res => {
            // console.log(res)
            this.setData({
                myPostList: that.data.myPostList.concat(res.threadlist),
                totalpage: res.total
            })
            that.judgeData(res.total)
        }, null, null)
    },
    // 我的朋友圈
    my_friends:function(){
        let that = this
        let dir = '{"auth":"' + app.globalData.userInfo.auth + '","page":"' + that.data.pageIndex +'"}';
        util.api_massage("post/get_posts_by_uid", dir, res => {
            // console.log(res)
            this.setData({
                myPostList: that.data.myPostList.concat(res.posts),
                totalpage: res.posts_totalpage
            })
            that.judgeData(res.posts_totalpage)
        }, null, null)
    },
    // 无数据时提示
    judgeData: function (res) {
        if (this.data.pageIndex == res) {
            this.setData({
                hasMore: false, //无数据时提示没有更多数据
            })
        }
    }
});