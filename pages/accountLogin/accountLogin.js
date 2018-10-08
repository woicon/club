// pages/accountLogin/accountLogin.js
Page({
    data: {

    },
    onLoad: function(options) {
        app.pageTitle(`登录${app.ext.appName}`)
    },
    toRegister() {
        wx.navigateTo({
            url: '/pages/accountRegister/accountRegister',
        })
    },
    onReady: function() {

    },
    onShow: function() {

    },
    loginAccount() {
        app.tip("登录成功")
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