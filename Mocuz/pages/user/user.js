//获取应用实例  
const app = getApp();
const util = require('../../utils/util.js')
Page({
    data:{
        userHeaderUrl: "http://www.ahhy.cn/uc_server/avatar.php?uid",
        userPhone: "注册/登录",
        userName: "怀远论坛",
        userGrade: "",
        userLevel: "",
        isLogin: 0,
        id_token: '',//方便存在本地的locakStorage  
        response: '', //存取返回数据  
        pageIndex: 1, //页码
    },
    onShow: function () {
        this.refreshView();
        this.myData()
    },
    onPullDownRefresh: function () {
        this.myData();
        this.refreshView();
        wx.stopPullDownRefresh(); //停止下拉刷新
    },
    //传递参数
    userPost: function (event) {
        let page = event.currentTarget.dataset.page;
        let title = event.currentTarget.dataset.title;
        wx.navigateTo({
            url: '../myPost/myPost?page='+page+'&title='+title
        })
    },
    // 帖子数量
    myData:function(){
        let that = this
        if (app.globalData.userInfo){
            let dir = '{"auth":"' + app.globalData.userInfo.auth + '"}';
            util.api_call("my.my", dir, res => {
                that.setData({
                    space_threads: res.data.space_threads,
                    topic_posts: res.data.topic_posts
                })
            }, null, null)
        }
    },
    //查看个人信息
    showUserInfo: function () {
        if (app.globalData.userInfo) {

        } else {
            wx.navigateTo({
                url: '../login/login'
            })
        }
    },
    //退出登录事件
    loginOut: function () {
        let that = this
        app.removeLocalUserInfo()
        app.globalData.userInfo = null;
        that.refreshView();
    },
    //刷新当前页面
    refreshView: function () {
        let that = this;
        // console.log(app.globalData.userInfo)
        if (app.globalData.userInfo) {
            that.setData({
                userHeaderUrl: app.globalData.userInfo.avatar,
                userName: app.globalData.userInfo.username,
                userPhone: app.globalData.userInfo.mobile,
                userGrade: app.globalData.userInfo.gender,
                userLevel: app.globalData.userInfo.grouptitle,
                isLogin: 1
            });
        } else {
            // console.log("刷新页面了2");
            that.setData({
                isLogin: 0,
                userName: "怀远论坛",
                userPhone: "注册/登录",
                userGrade:"",
                userLevel:"",
                userHeaderUrl: "http://www.ahhy.cn/uc_server/avatar.php?uid",
            })
        }
    },
    onShareAppMessage: function () {
        let that = this
        return {
            title: that.data.title,
            path: '/pages/user/user',
        }
    }
})  