// pages/memberOderDetail/memberOderDetail.js
let app = getApp()
Page({
    data: {

    },
    onLoad(options) {
        this.getDetail(options)
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#FF6363',
        })
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
    callOrganze(){
        wx.makePhoneCall({
            phoneNumber: this.data.detail.merchantPhone,
        })
    },
    onShow: function() {

    },
    onShareAppMessage: function() {

    }
})