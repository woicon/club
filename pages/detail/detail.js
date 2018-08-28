
Page({
    data: {
        url: null
    },
    onLoad: function(options) {
        let id = wx.getStorageSync("detailId")
        wx.setNavigationBarTitle({
            title: '活动详情',
        })
        this.setData({
            url: `https://hd.liantuobank.com/m/10190099_1/detail.htm?id=${id}&mode=preview`
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