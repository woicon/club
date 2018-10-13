// pages/memberOderDetail/memberOderDetail.js
let app = getApp()
Page({
    data: {
        pageLoading:true,
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
                    detail: res.data,
                    pageLoading:false
                })
            }
        })
    },
    callOrganze(){
        wx.makePhoneCall({
            phoneNumber: this.data.detail.merchantPhone,
        })
    },
    toInfo(e){
        wx.setStorageSync("orderApplyInfo", this.data.detail.orderEnrollRep)
        wx.navigateTo({
            url: '/pages/memberOrderApplyInfo/memberOrderApplyInfo',
        })
    },
    onShow: function() {

    },
    onShareAppMessage: function() {

    }
})