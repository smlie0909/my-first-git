const app = getApp();
const util = require('../../utils/util.js');
Page({
    /* 页面的初始数据*/
    data: {
        getCodeButtonTitle: "获取验证码",
        second: 60,
        buttonState: 1, /* 0不可点击  1可点击*/
        phoneNum: 0,       //手机号
        verCode: 0,//验证码
    },
    /* 登录 */
    loginUser: function () {
        let that = this;
        // console.log(that.data.verCode)
        if (that.data.verCode.length > 4 && that.data.phoneNum.length == 11 && that.validatemobile()) {
            let dir = '{"auth":"","mobile":"' + that.data.phoneNum + '","login_type":"2","code":"' + that.data.verCode + '"}';
            util.api_call("login", dir, res => {
                // console.log(res);
                if (res.errcode == 0) {
                    wx.hideNavigationBarLoading();
                    app.globalData.userInfo = res
                    wx.setStorage({
                        key: "KeyAppUser",
                        data: res
                    })
                    that.getWXLoginCode();
                    wx.navigateBack({})
                } else {
                    wx.hideNavigationBarLoading();
                    app.toastShow(that, res.errmsg, "icon-yanzhengma");
                }
            }, res => {
                //失败后的逻辑
                wx.hideNavigationBarLoading();
                wx.showToast({
                    title: res.msg,
                })
            }, res => {
                wx.hideNavigationBarLoading()
            })
        } else {
            wx.hideNavigationBarLoading()
            app.toastShow(that, "请完整填写信息", "icon-xinxitianxie");
        }
    },
    /* 获取验证码 */
    getCode: function () {
        let that = this;
        if (that.data.buttonState == 1 && that.data.phoneNum.length == 11 && that.validatemobile()) {
            wx.showNavigationBarLoading();
            let dir = '{"send_key":"mocuz_app_mobile_send","action":"verify_login","auth":"","mobile":"' + that.data.phoneNum + '","access_token":""}';
            util.api_call("verifycode", dir, res => {
                // console.log(res)
                if (res.errmsg == "success") {
                    wx.hideNavigationBarLoading()
                    app.countdown(that);
                } else {
                    wx.hideNavigationBarLoading()
                    app.toastShow(that, res.errmsg, "icon-yanzhengma");
                }
            }, res => {
                //失败后的逻辑
                wx.hideNavigationBarLoading()
                app.toastShow(that, res.errmsg, "icon-yanzhengma");
            }, null)
        } else if (that.data.phoneNum.length==undefined){
            wx.hideNavigationBarLoading()
            app.toastShow(that, "请输入手机号", "icon-yunongtongqingshurushoujihaoma");
        }else{
            if (that.data.buttonState != 0) {
                // console.log(that.data.phoneNum.length)
                wx.hideNavigationBarLoading()
                app.toastShow(that, "请校验手机号", "icon-yunongtongqingshurushoujihaoma");
            } ;
        }
    },
    getWXLoginCode: function () {
        let that = this;
        if (app.globalData.userId <= 0) {
            return;
        }
        wx.login({
            success: function (res) {
                // console.log(res)
                if (res.code) {
                    app.globalData.loginCode = res.code;
                } else {
                    // console.log('获取登录code失败: ' + res.errMsg)
                }
            }
        })
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
            app.toastShow(that, "请校验手机号", "icon-yunongtongqingshurushoujihaoma");
            return false;
        }
        return true;
    }
});