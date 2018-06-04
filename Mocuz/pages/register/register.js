// pages/register/register.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /* 页面的初始数据 */
    data: {
        getCodeButtonTitle: "获取验证码",
        second: 60,
        buttonState: 1, /* 0不可点击  1可点击*/
        userName: 0, //用户昵称
        phoneNum: 0,       //手机号
        password: 0, //密码
        verCode: 0,//验证码
    },
    /* 注册 */
    registerNewUser: function () {
        let that = this;
        if (that.data.verCode.length > 4 && that.data.phoneNum.length == 11 && 5 < this.data.password.length < 16 && that.validatemobile()) {
            wx.showNavigationBarLoading();
            let dir = '{"auth":"","regtype":"m","username":"' + that.data.userName + '","password":"' + that.data.password + '","mobile":"' + that.data.phoneNum + '","code":"' + that.data.verCode +'","agreebbrule":"1"}';
            util.api_call("register", dir, res => {
                console.log(res);
                if (res.errcode == 0) {
                    wx.hideNavigationBarLoading();
                    wx.showToast({
                        title: "注册成功",
                        icon: 'success',
                        duration: 2000
                    });
                    app.globalData.userInfo = {
                        uid : res.uid,
                        auth:res.auth,
                        avatar:"http://www.ahhy.cn/uc_server/avatar.php?uid",
                        mobile: that.data.phoneNum,
                        username: that.data.userName
                    }
                    // console.log(app.globalData.userInfo)
                    wx.setStorage({
                        key: "KeyAppUser",
                        data: app.globalData.userInfo
                    })
                    wx.switchTab({
                        url: '../user/user'
                    })
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
            }, null)
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
            let dir = '{"send_key":"mocuz_app_mobile_send","action":"verifycode","auth":"","mobile":"' + that.data.phoneNum + '","access_token":""}';
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
        } else if (that.data.phoneNum.length == undefined) {
            wx.hideNavigationBarLoading()
            app.toastShow(that, "请输入手机号", "icon-yunongtongqingshurushoujihaoma");
        } else {
            if (that.data.buttonState != 0) {
                // console.log(that.data.phoneNum.length)
                wx.hideNavigationBarLoading()
                app.toastShow(that, "请校验手机号", "icon-yunongtongqingshurushoujihaoma");
            };
        }
    },
    //昵称
    userName: function (e) {
        this.setData({
            userName: e.detail.value
        })
    },
    //手机号
    phoneNumber: function (e) {
        this.setData({
            phoneNum: e.detail.value
        })
    },
    //验证码
    verCode: function (e) {
        this.setData({
            verCode: e.detail.value
        })
    },
    //密码
    password: function (e) {
        this.setData({
            password: e.detail.value
        })
    },
    //手机号验证
    validatemobile: function () {
        let that = this;
        let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(that.data.phoneNum)) {
            app.toastShow(that, "请输入正确的手机号", "icon-yunongtongqingshurushoujihaoma");
            return false;
        }
        return true;
    },
})