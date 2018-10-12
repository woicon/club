// pages/memberOderDetail/memberOderDetail.js
let app = getApp()
Page({
    data: {

    },
    onLoad(options) {
        this.getDetail(options.id)
        app.pageTitle("订单详情")
    },
    getDetail(id) {
        app.api.myOrderDetail({
            orderId: id
        }).then(res => {
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