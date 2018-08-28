var api = require('newApi/newApi.js')
App({
    onLaunch: function() {
        console.log(api)
        wx.login({
            success: (res) => {
                wx.setStorageSync("code",res.code)
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
    api: api,
    tip(msg) {
        wx.showToast({
            title: msg,
            icon: "none"
        })
    },
    pageTitle(name){
        wx.setNavigationBarTitle({
            title:name,
        })
    },
    common(key) {
        let login = wx.getStorageSync("login")
        return login[key]
    }
})