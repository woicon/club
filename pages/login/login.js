let app = getApp()
Page({
    data: {

    },
    onLoad: function(options) {
        this.setData({
            backUrl: '/' + wx.getStorageSync("backUrl")
        })
    },
    getUserInfo(e) {
        wx.showLoading({
            title: '授权中',
        })
        console.log(e)
        let detail = e.detail
        let parmas = {
            code:wx.getStorageSync("code"),
            encryptedData: detail.encryptedData,
            iv: detail.iv,
            superiormerchantid: "10114186",
        }
        app.api.wechatRegister(parmas)
            .then(res => {
                console.log(res)
                wx.hideLoading()
                if (res.data) {
                    wx.setStorageSync("login", res.data)
                    wx.reLaunch({
                        url: wx.getStorageSync("backUrl"),
                    })
                } else {
                    app.tip(res.msg)
                }
            })
    },
    toBack: function() {
        let url = wx.getStorageSync("backUrl")
        wx.redirectTo({
            url: this.data.backUrl,
        })
    }
})