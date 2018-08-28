var api = require('../../newApi/newApi.js')
let app = getApp()
Page({
    data: {
        pageLoading: true,
        shareGroup: false,
        actStatus: {
            0: "进行中",
            1: "已关闭",
            2: "已删除",
            3: "已结束",
        }
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '活动分享',
        })
        Promise.all([api.activityShare(options, 'POST'), api.activityDetail({
                id: options.activityId
            }, 'POST')])
            .then(res => {
                console.log(res)
                this.setData({
                    shareImg:res[0].data,
                    detail:res[1].data,
                    pageLoading: false,
                    member:wx.getStorageSync("login")
                })
            })
    },
    shareGroup(){
        this.setData({
            mask:true,
        })
    },
    shareWe:function(){
        wx.showShareMenu({
            showShareMenu:true,
            success:function(){
                wx.showToast({
                    title: '转发成功',
                    icon:'none'
                })
            }
        })
    },
    onShareAppMessage(){
        if (res.from === 'button') {
            console.log(res.target)
        }
        return {
            title: '自定义转发标题',
            path: '/page/user?id=123'
        }
    },
    saveShare:function(e) {
        console.log(e)
        wx.getImageInfo({
            src:this.data.shareImg,
            success:(res)=>{
                console.log(res)
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success(res) {
                        console.log(res)
                        wx.showModal({
                            title: '保存成功',
                            content: '图片已保存到相册，快去发布朋友圈吧！',
                            showCancel:false,
                            confirmText:"我知道了"
                        })
                    }
                })
            }
        })
        
    },
    closeGroup:function() {
        this.setData({
            mask:false
        })
    },
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})