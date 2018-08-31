let app = getApp()
Page({
    data: {
        orderStatus: {
            0: "待支付",
            1: "待核销",
            2: "核销中",
            3: "已完成"
        },
        currentTab: 0,
        // 4取消 5过期 6待审核 7审核失败 8删除 9失败}
        //0待支付 1待核销 2核销中 3完成 4取消 5过期 6待审核 7审核失败 8删除 9失败
    },

    onLoad: function(options) {
        console.log(options)
        this.setData({
            activityId: options.activityId,
            merchantId: options.merchantId,
        })
        app.pageTitle("订单管理")
    },
    toggleTab(e) {
        this.setData({
            currentTab: e.currentTarget.dataset.id
        })
    },
    orderParmas() {
        let parmas = {
            page: 1,
            size: 20,
            activityId: 0,
        }
        return parmas
    },
    orderList() {

        app.api.activityOrderList()
            .then(res => {

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