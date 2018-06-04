const app = getApp();
const util = require('../../utils/util.js')
const WxParse = require('../../wxParse/wxParse.js')
Page({
    data: {
        pics: [], //图片
        domain: app.globalData.domain,//域名
        id:"",
        detailsList:[],
        comment_list:[],
        value:"",
        totalpage:1,
        responsecount:"",
        select:"false",
        pageIndex: 1, //页码
    },
    onLoad: function (options) {
        // console.log(options)
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        this.setData({
            id:this.options.tid
        })
        this.requestLocalDetailsDate()
    },
    bindInputSend:function(e){
        this.setData({
            value: e.detail.value
        })
        if (!app.globalData.userInfo) {
            wx.showToast({
                title: "请先登录",
                icon: 'success',
                duration: 1500
            });
        }else{
            this.localComment()
        }
    },
    // 本地圈帖子详情
    requestLocalDetailsDate: function () {
        let that = this;
        let dir = '';
        if (app.globalData.userInfo) {
            dir = '{"auth":"' + app.globalData.userInfo.auth + '","postid":"' + that.data.id + '","page":"' + that.data.pageIndex +'"}'; 
        }else{
            dir = '{"auth":"","postid":"' + that.data.id + '","page":"' + that.data.pageIndex +'"}'; 
        }
        util.api_massage("post/weixin_post_detail", dir, res => {
            let article = res.data.usergroup_level;
            that.setData({
                detailsList: res.data,
                comment_list: res.data.comment.comment_list,
                like_users: res.data.like_users,
                responsecount: res.data.responsecount,
                likecount: res.data.likecount,
                authorid: res.data.uid,
                ctime_format: res.data.ctime_format,
                author: res.data.username,
                subject: res.data.content_title,
                content: res.data.content,
                readcount: res.data.readcount,
                praid:res.data.praid,
            })
            WxParse.wxParse('article', 'html', article, that, 15);
            for (let i = 0; i < res.data.img_arr.length;i++){
                that.setData({
                    pics:that.data.pics.concat(res.data.img_arr[i].path)
                })
            }
        }, res => {
            wx.hideNavigationBarLoading();
        }, () => {
            wx.hideNavigationBarLoading();
        })
    },
    //本地圈评论
    localComment:function(){
        let that = this;
        let dir = '{"auth":"' + app.globalData.userInfo.auth + '","comment":"' + this.data.value + '","postid":"' + this.data.detailsList.id + '","to_uid":"' + this.data.detailsList.uid + '","to_username":"' + this.data.detailsList.username +'"}';
        if (this.data.value == "") {
            app.toastShow(that, "评论信息不能为空！", "icon-xinxitianxie");
        } else {
            util.api_massage("comment/send_comment", dir, res => {
                that.data.comment_list.push({
                    "uid": app.globalData.userInfo.uid,
                    "username": app.globalData.userInfo.username,
                    "content": that.data.value,
                    "ctime_format": "刚刚",
                    "likecount": 0,
                })
                that.setData({
                    comment_list: that.data.comment_list,
                    responsecount: parseInt(that.data.responsecount) + 1,
                    value: ''
                });
            }, res => {
                wx.hideNavigationBarLoading();
            }, () => {
                wx.hideNavigationBarLoading();
            });
        }
    },
    // 点赞
    zan:function(){
        if (!app.globalData.userInfo) {
            wx.showToast({
                title: "请先登录",
                icon: 'success',
                duration: 1500
            });
        }else{
            this.localZan()
        }
    },
    // 本地圈点赞
    localZan:function(e){
        let that = this;
        let dir = '{"auth":"' + app.globalData.userInfo.auth + '","postid":"' + that.data.id + '","to_uid":"' + app.globalData.userInfo.uid + '"}';
        util.api_massage("post/like_kh", dir, res => {
            // console.log(res)
            if (res.errcode == 0 && that.data.praid == '') {
                that.setData({
                    likecount: parseInt(that.data.likecount) + 1,
                    praid: true
                });
            } else {
                wx.showToast({
                    title: '您已赞过了',
                });
            }
        }, null, null)
    },
    // 无数据时提示
    judgeData: function (res) {
        if (this.data.pageIndex == res) {
            this.setData({
                hasMore: false, //无数据时提示没有更多数据
            })
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
});