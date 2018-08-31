// pages/checkDetail/checkDetail.js
Page({
    data: {

    },

    onLoad: function(options) {
        let detail = wx.getStorageSync("checkDetail")
        this.setData({
            detail: detail
        })
    },
    backScan: function() {
        wx.navigateBack()
    },
    onReady: function() {

    },

    onShow: function() {

    }
    
})