//app.js
App({
    globalData: {
        userInfo: null,
        openid: 0,
        token: 0,
        userId: 0,
        hasAddress: false,
        loginCode: 0,
        wxOpenId: 0,
        key:"636d82b614235f1bcfd08969",
        domain:"http://utf8develop.mocuz.com"
    },
    onLaunch: function () {
        // 展示本地存储能力
        let logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        this.getLocalUserInfo();
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res =>{
                if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            console.log(this.userInfoReadyCallback)
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                } 
            }
        })
    },
    // 自定义tosat
    toastShow: function (that, str, icon) {
        that.setData({
            isShow: true,
            txt: str,
            iconClass: icon
        });
        setTimeout(function () {
            that.setData({
                isShow: false
            });
        }, 1500);
    },
    //获取本地存储的用户信息,token等
    getLocalUserInfo: function () {
        let that = this;
        wx.getStorage({
            key: 'KeyAppUser',
            success: function (res) {
                // console.log("KeyAppUser" + res)
                that.globalData.userInfo = res.data
                that.globalData.userId = res.data.uid
            }
        })
        wx.getStorage({
            key: 'KeyAppUserToken',
            success: function (res) {
                console.log("KeyAppUserToken" + res.data)
                that.globalData.token = res.data
            }
        })

    },

    //清除本地存储的用户信息,token等
    removeLocalUserInfo: function () {
        let that = this;
        wx.removeStorage({
            key: 'KeyAppUser',
            success: function (res) {
                that.globalData.userId = 0
                that.globalData.token = 0
                that.globalData.userInfo = null
                that.globalData.openid = 0
            },
        }),

        wx.removeStorage({
            key: 'KeyAppUserToken',
            success: function (res) {
                that.globalData.token = 0
            },
        })
    },
    // 倒计时
    countdown:function(that){
        let self = this;
        let second = that.data.second;
        if (second == 0) {
            that.setData({
                getCodeButtonTitle: "获取验证码",
                second: 60,
                buttonState: 1,
            });
            return;
        } else {
            that.setData({
                getCodeButtonTitle: "倒计时" + second,
                buttonState: 0,
            });
        }
        let timer = setTimeout(function () {
            that.setData({
                second: second - 1
            });
            self.countdown(that);
        }, 1000)
    }
})