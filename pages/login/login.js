let app = getApp()
Page({
    data: {

    },
    onLoad: function (options) {
        this.setData({
            backUrl: '/' + wx.getStorageSync("backUrl")
        })
    },
    getUserInfo(e) {
        console.log(e)
        if (e.detail) {
            this.login(e.detail)
        } else {
            app.tip('请您允许授权登录，否则无法使用该App')
        }
    },
    login(detail) {
        wx.showLoading({
            title: '授权中',
        })
        app.login(detail)
        // wx.login({
        //     success: (res) => {
        //         console.log(res)
        //         wx.request({
        //             url: `${app.ext.host}/api/wechatAppSession.htm`,
        //             data: {
        //                 appId: app.ext.appId,
        //                 jsCode: res.code
        //             },
        //             success: (data) => {
        //                 console.log(data)
        //                 let parmas = {
        //                     encryptedData: detail.encryptedData,
        //                     iv: detail.iv,
        //                     sessionKey: data.data.result.session_key,
        //                     superiorMerchantId: app.ext.merchantId,
        //                 }
        //                 app.api.wechatRegister(parmas)
        //                     .then(res => {
        //                         console.log(res)
        //                         wx.hideLoading()
        //                         if (res.data) {
        //                             wx.setStorageSync("login", res.data)
        //                             wx.reLaunch({
        //                                 url: wx.getStorageSync("backUrl"),
        //                             })
        //                         } else {
        //                             app.tip(res.msg)
        //                         }
        //                     })
        //             }
        //         })
        //     }
        // })
    },
    toBack: function () {
        let url = wx.getStorageSync("backUrl")
        wx.redirectTo({
            url: this.data.backUrl,
        })
    }
})