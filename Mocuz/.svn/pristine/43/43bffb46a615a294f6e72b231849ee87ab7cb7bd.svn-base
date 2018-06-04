const app = getApp();
const loginUrl = require('../../config').login;
function countdown(that) {
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
        })
    }
    let timer = setTimeout(function () {
        that.setData({
            second: second - 1
        });
        countdown(that);
    }, 1000)
}
Page({

    /**
    * 页面的初始数据
    */
    data: {
        getCodeButtonTitle: "获取验证码",
        second: 60,
        buttonState: 1, /* 0不可点击  1可点击*/
        phoneNum: 0,       //手机号
        verCode: 0,//验证码
    },
    /**
    * 获取验证码
    */
    getCode: function () {
        let that = this;
        if (that.data.buttonState == 1 && that.data.phoneNum.length == 11 && that.validatemobile()) {
            wx.showNavigationBarLoading();
            
            // let dict = {
            //     phoneCode: that.data.phoneNum,
            // }
            // console.log(app.globalData)
            wx.request({
                url: loginUrl,
                auth: 'token',
                login_type:2,
                mobile: that.data.phoneNum,
                success: function (res) {
                    // console.log(res.data);
                    wx.hideNavigationBarLoading();
                    countdown(that);
                    that.setData({
                        
                    })
                },
                fail: function (res) {
                    //失败后的逻辑
                    wx.hideNavigationBarLoading();
                    wx.showToast({
                        title: res.data.msg,
                    })
                    console.log("error")
                },
            })
        } else {
            if (that.data.buttonState == 0) {

            } else {
                wx.showToast({
                    title: '请校验手机号',
                })
            }
        }
    },
    phoneNumber: function (e) {
        let that = this;
        that.setData({
            phoneNum: e.detail.value
        });
    },
    registerUrl:function(){
        wx.navigateTo({
            url: '../register/register'
        })
    },
    verCode: function (e) {
        let that = this;
        that.setData({
            verCode: e.detail.value
        })
    },
    validatemobile: function () {
        let that = this;
        let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(that.data.phoneNum)) {
            wx.showToast({
                title: '手机号有误！',
                icon: 'success',
                duration: 1500
            })
            return false;
        }
        return true;
    }
});