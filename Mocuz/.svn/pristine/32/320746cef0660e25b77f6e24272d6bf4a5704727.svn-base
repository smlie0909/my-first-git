let app = getApp();
Page({
    data: {
        pics: [],
    },
    choose: function () {//这里是选取图片的方法
        let that = this,
        pics = this.data.pics;
        wx.chooseImage({
            count: 9 - pics.length, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                let imgsrc = res.tempFilePaths;
　　　　　　　　　pics = pics.concat(imgsrc);
                that.setData({
                    pics: pics
                });
            },
            fail: function () {
                wx.hideToast();
                wx.showModal({
                    title: '错误提示',
                    content: '上传图片失败',
                    showCancel: false,
                    success: function (res) { }
                }) 
            },
            complete: function () {
                // complete
            }
        })

    },
    // 删除图片
    deleteImg: function (e) {
        let imgs = this.data.pics;
        let index = e.currentTarget.dataset.index;
        imgs.splice(index,1);
        this.setData({
            pics: imgs
        });
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
    uploadimg: function () {//这里触发图片上传的方法
        let pics = this.data.pics;
        console.log(pics)
        app.uploadimg({
            url: 'https://........',//这里是你图片上传的接口
            path: pics//这里是选取的图片的地址数组
        });
    },
    onLoad: function (options) {

    }

});