// pages/memberOderDetail/memberOderDetail.js
let app = getApp()
Page({
    data: {

    },
    onLoad(options) {
        this.getDetail(options)
        app.pageTitle("订单详情")
    },
    getDetail(params) {
        app.api.myOrderDetail(params).then(res => {
            if (res.status == '200') {
                this.setData({
                    detail: res.data
                })
            }
        })
    },
    onShow: function() {

    },
    onShareAppMessage: function() {

    }
})