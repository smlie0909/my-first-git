const app = getApp()
const util = require('../../utils/util.js')
const DES3 = require('../../utils/DES3.min.js').des;
Page({
    data: {
        imgDefault: '../../images/loading2.png',
        arr: [],
        arrHeight: [],
        itemHeight: 0,
        currentIndex: null,
        domain: app.globalData.domain,//域名
        hotData: [],    //帖子列表
        contentData: [],
        pratype:0,
        topicsData: {}, //热门话题展示列表
        rankingData: {}, //人气排行展示列表
        pic:[],
        pics: [], //上传图片
        iconData:[],
        pageIndex: 1, //页码
        totalpage: "", //总页数
        hasMore: true,  //"上拉加载"的变量，默认true，显示; “没有数据”的变量，false，隐藏
        praisetype: false //点赞状态
    },
    onLoad:function(){
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        this.firstHotlist();
        if (!app.globalData.userInfo) {
            app.globalData.userInfo = "";
            this.requestHotlistDate()
        } else {
            this.setData({
                uid: app.globalData.userInfo.uid,
            })
            this.requestHotlistDate()
        }
    },
    onShow: function () {
        let that = this
        // 解决发布帖子刷新的问题
        wx.getStorage({
            key: 'keypagetype',
            success: function (res) {
                if (res.data == "local") {
                    that.initList();
                }
                wx.removeStorageSync('keypagetype');
            }
        })
        wx.setStorage({
            key: "keypic",
            data: ""
        })
        this.setData({ pic: [] })
    },
    onReady: function () {
        setTimeout(() => {
            this.getRect();
        }, 2000)
    },
    getRect: function () {
        let that = this;
        wx.createSelectorQuery().select('.speak-img').boundingClientRect(function (rect) {
            if (rect == null) {

            } else {
                // console.log(rect)
                that.setData({
                    itemHeight: rect.height
                })
                that.init(rect.height)
            }
        }).exec()
    },
    init: function (itemHeight) {
        let index = parseFloat(app.globalData.windowHeight / itemHeight);
        for (let i = 0; i < index * 2; i++) {
            this.data.arr[i] = true;
        }
        this.setData({ arr: this.data.arr });
        for (let i = 0; i < this.data.arr.length; i++) {
            this.data.arrHeight[i] = Math.floor(i / 2) * (itemHeight + 10);
        }
    },
    onPageScroll: function (e) {
        for (let i = 0; i < this.data.arrHeight.length; i++) {
            if (this.data.arrHeight[i] < e.scrollTop + app.globalData.windowHeight) {
                if (this.data.arr[i] === false) {
                    this.data.arr[i] = true;
                }
            }
        }
        this.setData({ arr: this.data.arr });
    },
    //帖子详情
    jumpDetails: function (event) {
        let itemId = event.currentTarget.id;
        let itemName = event.currentTarget.dataset.details;
        wx.navigateTo({
            url: '/pages/details/details?tid=' + itemId + '&details=' + itemName
        })
    },
    //话题详情
    jumpTopics: function (event){
        let itemId = event.currentTarget.id;
        let itemName = event.currentTarget.dataset.title;
        wx.navigateTo({
            url: '/pages/topicDetail/topicDetail?id=' + itemId + '&title=' + itemName
        })
    },
    //首次加载的热门话题列表
    firstHotlist: function () {
        let that = this;
        let dir = '{"auth":"","op":"index","page":"1"}';
        util.api_massage("topic/get_topic_index", dir, res => {
            // console.log(res.posts)
            that.setData({
                topicsData: that.getRandomArrayElements(res.topics, 3),
            })
        },null, null)
    },
    //加载初始数据
    initList: function () {
        let that = this;
        let dir = '{"auth":"' + app.globalData.userInfo.auth + '","op":"index","page":"' + that.data.pageIndex + '","version":"4"}';
        util.api_massage("topic/get_topic_index/", dir, res => {
            // console.log(res)
            that.setData({
                hotData: res.posts
            })
        }, null, null)
    },
    // 上拉刷新回调接口
    onReachBottom: function () {
        let that = this;
        this.setData({
            pageIndex: this.data.pageIndex + 1, //每次下拉到底部触发 pageIndex+1
        })
        that.requestHotlistDate();
    },
    // 下拉刷新回调接口
    onPullDownRefresh: function () {
        this.setData({
            pageIndex: 1,
        })
        this.initList();
        wx.stopPullDownRefresh(); //停止下拉刷新
    },
    // 点赞
    like:function(e){
        // console.log(e)
        let comid = e.currentTarget.dataset.id
        let that = this;
        if (app.globalData.userInfo){
            let dir = '{"auth":"' + app.globalData.userInfo.auth + '","postid":"' + comid + '","to_uid":"' + e.currentTarget.dataset.uid + '"}';
            util.api_massage("post/like_kh", dir, res => {
                let tmp = this.data.hotData.map(function (arr, index) {
                    if (comid == arr.id) {
                        if (arr.praid == 0 ) {
                            arr.praid = 1;
                            arr.praiselist.unshift(app.globalData.userInfo.uid)
                            arr.likecount++;
                            wx.showToast({
                                title: "点赞成功",
                            })
                        }else{
                            wx.showToast({
                                title: "您已赞过了",
                            })
                        }
                    }
                    return arr;
                })
                that.setData({ hotData: tmp });
            }, null, null)
        }else{
            wx.showToast({
                title: "请先登录",
                icon: 'success',
                duration: 1500
            });
        }  
    },
    //换一批
    anotherBatch:function(){
        this.firstHotlist();
    },
    // 加载热门话题数据
    requestHotlistDate: function () {
        let that = this;
        let dir = '{"auth":"' + app.globalData.userInfo.auth + '","op":"index","version":"4","page":"' + that.data.pageIndex + '"}';
        if (that.data.pageIndex == that.data.totalpage) { //当pageIndex小于page页数时加载数据  
            that.setData({
                hasMore: false, //无数据时提示没有更多数据
            });
        } else {
            util.api_massage("topic/get_topic_index/", dir, res => {
                // console.log(res)
                if(res.posts==''){
                    that.setData({
                        hasMore: false, //无数据时提示没有更多数据
                    });
                }
                for (let i = 0; i < res.posts.length; i++) {
                    that.data.arr.push(false);
                }
                that.setData({
                    rankingData: res.hot_post,
                    hotData: that.data.hotData.concat(res.posts),
                    totalpage: res.posts_totalpage,
                    hastopic: res.hastopic
                })
            }, null, null)
        } 
    },
    //数组随机筛选
    getRandomArrayElements: function (arr, count){
        let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }, 
    choose: function (event) {//这里是选取图片的方法
        this.setData({pics:''})
        let that = this,
            pics = this.data.pics
        wx.chooseImage({
            count: 9 - pics.length, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                pics = pics.concat(res.tempFilePaths);
                that.setData({
                    pics: pics
                });
                let successUp = 0; //成功个数
                let failUp = 0; //失败个数
                let length = res.tempFilePaths.length; //总共个数
                let i = 0; //第几个
                that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length)
            },
            fail: function () {
                wx.hideToast();
            },
            complete: function () {
                // complete
            }
        })
    },
    //上传图片首次回执
    uploadDIY: function (filePaths, successUp, failUp, i, length){
        let that = this
        util.api_upload('post/post_upload_imgs', filePaths[i] , res=>{
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
        },(res) => {
            failUp++;
        },() => {
            i++;
            if (i == length) {
                console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
                wx.setStorage({
                    key: "keypic",
                    data: that.data.pic
                })
                wx.navigateTo({
                    url: '/pages/post/post?post=local&pics=' + that.data.pics
                })
            }
            else {  //递归调用uploadDIY函数
                that.uploadDIY(filePaths, successUp, failUp, i, length);
            }
        })
    },
    jumpPost: function (event) {
        let post = event.currentTarget.dataset.post
        wx.navigateTo({
            url: '/pages/post/post?post=' + post
        })
    },
    onShareAppMessage: function () {
        let that = this
        return {
            title: that.data.title,
            path: '/pages/local/local',
        }
    }
});