let app = getApp()
Page({
    data: {
        pageLoading:true,
    },
    onLoad: function(options) {
        app.pageTitle("会员管理")
        
    },

    onReady: function() {

    },

    onShow() {
        let parmas = {
            page: 1,
            size: 20,
            merchantId: app.common("merchantId")
        }
        app.api.getMemberList(parmas)
            .then((res) => {
                this.setData({
                    pageLoading: false,
                })
            })
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