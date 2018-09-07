var api = require('newApi/newApi.js')
App({
    onLaunch: function(options) {
        let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
        this.ext = extConfig
        this.api = api(extConfig.host)
        wx.setStorageSync("ext", extConfig)
    },
    globalData: {
        userInfo: null
    },
    currPage: function() {
        let _curPageArr = getCurrentPages()
        return _curPageArr[_curPageArr.length - 1]
    },
    checkLogin() {
        let currPage = this.currPage()
        let _currPage = currPage
        wx.setStorageSync("backUrl", '/' + _currPage.route)
        if (!wx.getStorageSync("login")) {
            wx.reLaunch({
                url: '/pages/login/login',
            })
        }
    },
    navTo(url) {
        wx.navigateTo({
            url: url,
        })
    },
    tip(msg) {
        wx.showToast({
            title: msg,
            icon: "none"
        })
    },
    pageTitle(name) {
        wx.setNavigationBarTitle({
            title: name,
        })
    },
    common(key) {
        let login = wx.getStorageSync("login")
        return login[key]
    },
    isLogin(cb) {
        let currPage = this.currPage()
        if (wx.getStorageSync("login")) {
            currPage.setData({
                member: wx.getStorageSync("login")
            })
            if (cb) {
                cb()
            }
        } else {
            currPage.setData({
                member: null,
                pageLoading: false
            })
        }
    },
    login(detail, cb) {
        console.log(detail)
        let currPage = this.currPage()
        // currPage.setData({
        //     btnLoading: true
        // })
        if (detail.encryptedData) {
            wx.login({
                success: (res) => {
                    console.log(res)
                    wx.request({
                        url: `${this.ext.host}/api/wechatAppSession.htm`,
                        data: {
                            appId: this.ext.appId,
                            jsCode: res.code
                        },
                        success: (data) => {
                            console.log(data)
                            let parmas = {
                                encryptedData: detail.encryptedData,
                                iv: detail.iv,
                                sessionKey: data.data.result.session_key,
                                superiorMerchantId: this.ext.merchantId,
                            }
                            this.api.wechatRegister(parmas)
                                .then(res => {
                                    // console.log(res)
                                    wx.hideLoading()
                                    if (res.data) {
                                        wx.setStorageSync("login", res.data)
                                        // wx.reLaunch({
                                        //     url: wx.getStorageSync("backUrl"),
                                        // })
                                        this.tip("登录成功")
                                        cb()
                                    } else {
                                        //this.tip(res.msg)
                                    }
                                })
                        }
                    })
                },
                fail: (error) => {
                    console.log(error)
                }
            })
        } else {
            currPage.setData({
                btnLoading: false
            })
            wx.showModal({
                title: '登录失败',
                content: '小程序需要您的授权才能继续访问',
                showCancel: false
            })
        }
    }
})