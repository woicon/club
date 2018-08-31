var api = require('newApi/newApi.js')
App({
    onLaunch: function(options) {
        let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
        this.ext = extConfig
        this.api = api(extConfig.host)
        wx.setStorageSync("ext", extConfig)
        wx.login({
            success: (res) => {
                wx.setStorageSync("code", res.code)
            }
        })
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
    }
})