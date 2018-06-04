const app = getApp()
const util = require('../../utils/util.js');
Page({
    data: {
        curIndex: 0,
        sectionIconData:{},
        childArray:[],
        unfollow:0,
        follow:"关注"
    },
    onLoad: function (options) {
        let that = this;
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        this.requestsectionIconDate();
    },
    //事件处理函数
    jumpTemplate: function (event) {
        // console.log(event)
        let itemId = event.currentTarget.id;
        let name = event.currentTarget.dataset.title
        if (this.options.post == "community"){
            wx.navigateTo({
                url: '/pages/post/post?id=' + itemId + '&&post=community',
            })
        }else{
            wx.navigateTo({
                url: '/pages/blockList/blockList?id=' + itemId + '&&title=' + name,
            })
        }
        
    },
    jumpTo: function (e) {
        // 点击标题切换当前页时改变样式
        let that = this;
        let index = parseInt(e.currentTarget.dataset.index);
        this.setData({
            curIndex: index,
            loading: true,
        })
        util.api_call("index", null, res => {
            let temp = res.catlist[index];
            that.setData({
                childArray: temp,
            })
        }, null, () => {
            wx.hideNavigationBarLoading();
        });
    },
    //版块列表加载
    requestsectionIconDate: function () {
        let that = this;
        util.api_call("index", null, res => {
            let temp = res.catlist[0]
            that.setData({
                sectionIconData: res.catlist,
                childArray: temp,
            })
        }, null, () => {
            wx.hideNavigationBarLoading();
        })
    }
});