let app = getApp()
Page({
    data: {

    },
    onLoad: function(options) {
        app.pageTitle("资料设置")
        this.setData({
            member: wx.getStorageSync("login")
        })
        app.api.selectData({
            userid: app.common('id')
        }).then(res => {
            console.log(res)
            this.setData({
                data: res.data
            })
        })
    },
    newValue(e) {
        console.log(e)
        let data = this.data.data[e.target.id]
        this.setData({
            target: e.detail.value
        })
    },
    upPic() {
        wx.chooseImage({
            success: (res) => {
                console.log(res)
                app.api.uploadPic(res.tempFilePaths[0], (img) => {
                    this.setData({
                        'data.logourl': img
                    })
                })
            },
        })
    },
    submitData(e) {
        console.log(e)
        app.api.dataSet(e.detail.value)
            .then(res => {
                console.log(res)
                wx.showToast({
                    title: res.data,
                    icon: "none"
                })
            })
    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    }
})