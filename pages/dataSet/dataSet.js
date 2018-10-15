let app = getApp()
Page({
    data: {

    },
    onLoad: function(options) {
        app.pageTitle("资料设置")
        this.setData({
            member: wx.getStorageSync("login")
        })

    },
    onShow() {
        app.api.selectData({
            userId: app.common('id')
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
                        'data.logoUrl': img
                    })
                })
            },
        })
    },
    submitData(e) {
        app.api.dataSet(e.detail.value)
            .then(res => {
                wx.showToast({
                    title: res.data,
                    icon: "none"
                })
                wx.navigateBack()
            })
    }
})