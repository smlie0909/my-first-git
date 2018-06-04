const app = getApp(); 
const util = require('../../utils/util.js');
const DES3 = require('../../utils/DES3.min.js').des;
Page({
    data: {
        pics: [], //上传图片
        despic:'',
        title:"",  //标题
        pagetype:'', //当前页的状态
        topicsList:[]
    },
    onLoad: function () {
        console.log(this.options)
        let that = this
        if(this.options.post == "local"){
            this.setData({
                pagetype: this.options.post,
                pics: this.options.pics.split(","),
            });
            this.requestTopicListDate()
        }else{
            wx.setStorage({//记录发帖页面状态
                key: "keyTopic",
                data: ""
            })
            this.setData({
                topic:"",
                pagetype: this.options.post,
            });
        }
        wx.getStorage({
            key: 'keypic',
            success: function (res) {
                if (that.options.post == "local") {
                    that.setData({
                        pic: res.data
                    })
                }
            }
        }) 
    },
    onShow:function(){
        let that = this;
        wx.getStorage({
            key: 'keyTopic',
            success: function (res) {
                if (that.options.post == "local") {
                    if(res.data != ''){
                        that.setData({
                            content: '#'+res.data+'#'
                        })
                    }
                }
            }
        })
        
    },
    jumptopicList:function(){
        if (app.globalData.userInfo){
            wx.navigateTo({
                url: '../topicList/topicList'
            })
        }else{
            wx.showToast({
                title: "请先登录",
                icon: 'success',
                duration: 1500
            });
        }
    },
    // 加载话题列表
    requestTopicListDate:function(){
        let that = this;
        let dir = '{"op":"index"}';
        util.api_massage("topic/topic_list", dir, res => {
            // console.log(res)
            that.setData({
                topicsList: that.getRandomArrayElements(res.isrectopic, 6),
                content: '#' + res.isrectopic[0].title + '#'
            })
        }, res => {
            wx.hideNavigationBarLoading();
        }, () => {
            wx.hideNavigationBarLoading();
        })
    },
    //填充话题头
    titleFill:function(event){
        let title = event.currentTarget.dataset.title;
        wx.setStorage({//记录发帖页面状态
            key: "keyTopic",
            data: title
        })
        this.setData({
            content:title
        })
    },
    //发布帖子
    release:function(){
        if (this.data.pagetype =="community"){
            this.communityPost()
        }else{
            this.localPost()
        }
    },
    // 社区发帖
    communityPost:function(){
        let that = this;
        wx.showNavigationBarLoading();
        if (app.globalData.userInfo){
            let dir = '{"auth":"' + app.globalData.userInfo.auth + '","subject":"' + that.data.title + '","message":"' + that.data.content + '","fid":"' + that.options.id + '"}';
            if (that.data.content != '' && that.data.title != '') {
                util.api_call("newthread", dir, res => {
                    wx.hideNavigationBarLoading();
                    wx.setStorage({//记录发帖页面状态
                        key: "keypagetype",
                        data: that.data.pagetype
                    })
                    setTimeout(function () {
                        wx.showToast({
                            title: '发帖成功',
                            icon: 'success',
                            duration: 1000
                        })
                    }, 2000)
                    wx.switchTab({
                        url: '../community/community'
                    })
                }, (res) => {
                    wx.hideNavigationBarLoading();
                    wx.showToast({
                        title: res.msg,
                    })
                }, () => {
                    wx.hideNavigationBarLoading();
                });
            } else if (that.data.title == '') {
                wx.hideNavigationBarLoading();
                app.toastShow(that, "标题不能为空哦~", "icon-xinxitianxie");
            } else if (that.data.content == '') {
                wx.hideNavigationBarLoading();
                app.toastShow(that, "内容不能为空哦~", "icon-xinxitianxie");
            } 
        }else{
            wx.hideNavigationBarLoading();
            wx.showToast({
                title: "请先登录",
                icon: 'success',
                duration: 1500
            });
        }
    },
    // 本地圈发帖
    localPost:function(){
        let that = this;
        wx.showNavigationBarLoading();
        console.log(app.globalData.userInfo)
        if (app.globalData.userInfo) {
            let dir = '{"auth":"' + app.globalData.userInfo.auth + '","platform":"","videopath":"","attachmenttype":"image","content":"' + that.data.content + '", "version":"4","pic_arr":' + JSON.stringify(this.data.pic) +'}'
            util.api_massage("post/sendpost", dir, res => {
                console.log(res)
                wx.hideNavigationBarLoading();
                wx.removeStorageSync('keypic');
                wx.setStorage({
                    key: "keypagetype",
                    data: that.data.pagetype
                })
                wx.setStorage({
                    key: "keyTopic",
                    data: ""
                })
                setTimeout(function () {
                    wx.showToast({
                        title: '发帖成功',
                        icon: 'success',
                        duration: 1000
                    })
                }, 2000)
                wx.switchTab({
                    url: '../local/local'
                })
            }, res => {
                wx.hideNavigationBarLoading();
                wx.showToast({
                    title: res.msg,
                })
            }, () => {
                wx.hideNavigationBarLoading();
            })
        } else {
            wx.hideNavigationBarLoading();
            wx.showToast({
                title: "请先登录",
                icon: 'success',
                duration: 1500
            });
        }
    },
    // 发布标题
    title: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    // 发布内容
    content: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    choose: function () {//这里是选取图片的方法
        let that = this,
            pics = this.data.pics;
        wx.chooseImage({
            count: 9 - pics.length, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                console.log(res)
                pics = pics.concat(res.tempFilePaths);
                that.setData({
                    pics: pics
                });
                if (that.options.post == "local"){
                    let successUp = 0; //成功个数
                    let failUp = 0; //失败个数
                    let length = res.tempFilePaths.length; //总共个数
                    let i = 0; //第几个
                    that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length)
                }else{
                    const base64 = encode.base64encode(that.data.pics)
                    // console.log("base64:" + base64)  
                }
            },
            fail: function () {
                wx.hideToast();
            }
        })
    },
    // 删除图片
    deleteImg: function (e) {
        let that = this
        let imgs = this.data.pics;
        let index = e.currentTarget.dataset.index;
        imgs.splice(index, 1);
        if (that.options.post == "local") {
            let img = this.data.pic
            img.splice(index, 1);
            that.setData({
                pics: imgs,
                pic: img
            });
        }else{
            that.setData({
                pics: imgs
            });
        }
    },
    // 预览图片
    previewImg: function (e) {
        //获取当前图片的下标
        let index = e.currentTarget.dataset.index;
        //所有图片
        let imgs = this.data.pics;
        wx.previewImage({
            //当前显示图片
            current: imgs[index],
            //所有图片
            urls: imgs
        })
    },
    //数组随机筛选
    getRandomArrayElements: function (arr, count) {
        let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }, 
    //上传图片首次回执
    uploadDIY: function (filePaths, successUp, failUp, i, length) {
        let that = this
        util.api_upload('post/post_upload_imgs', filePaths[i], res => {
            // console.log(res)
            let despic = DES3.decrypt(app.globalData.key, res);
            successUp++;
            let pics = JSON.parse(despic).pic_arr
            pics = JSON.parse(pics)
            let tmp = this.data.pic
            tmp.push(pics[0])
            that.setData({
                pic: tmp
            })
        }, (res) => {
            failUp++;
        }, () => {
            i++;
            if (i == length) {
                console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
                wx.setStorage({
                    key: "keypic",
                    data: that.data.pic
                })
            }
            else {  //递归调用uploadDIY函数
                that.uploadDIY(filePaths, successUp, failUp, i, length);
            }
        })
    },
})