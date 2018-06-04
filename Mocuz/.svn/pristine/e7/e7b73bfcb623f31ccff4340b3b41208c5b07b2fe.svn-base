//获取应用实例  
const app = getApp()
Page({
    data: {
        userInfo: {},
        userHeaderUrl: "../../images/touxiang.jpg",
        userPhone: "注册/登录",
        userName: "MOCUZ",
        userGrade: "V0",
        isLogin: 0,
        id_token: '',//方便存在本地的locakStorage  
        response: '' //存取返回数据  
    },
    onLoad: function () {
        // console.log("去登录");
        let that = this;
        that.refreshView();
    },
    login:function(){
        wx.getStorage({
            key: "LoginSessionKey",
            success: function (res) {
                console.log(res.data)
            }
        })
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
        app.removeLocalUserInfo();
        let that = this;
        app.globalData.userInfo = null;
        that.refreshView();
    },
    //刷新当前页面
    refreshView: function () {
        let that = this;
        if (app.globalData.userInfo) {
            console.log("刷新页面了");
            that.setData({
                // userHeaderUrl: app.globalData.userInfo.userVO.userUrl,
                userHeaderUrl: app.globalData.userInfo.avatarUrl,
                // userPhone: app.globalData.userInfo.userVO.userName,
                // userName: app.globalData.userInfo.userVO.nickName,
                userName: app.globalData.userInfo.nickName,
                isLogin: 1,
            })

        } else {
            console.log("刷新页面了2");
            that.setData({
                isLogin: 0,
                userName: "MOCUZ",
                userPhone: "注册/登录",
                userGrade:"",
                userHeaderUrl: "../../images/touxiang.jpg",
            })
        }
    },
})  