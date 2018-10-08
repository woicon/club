let app = getApp()
Page({
    data: {

    },
    onLoad: function(options) {
        app.pageTitle(`注册${app.ext.appName}`)
    },
    onReady: function() {

    },
    registerAccount() {
        app.tip("注册成功")
        wx.navigateBack({
            
        })
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