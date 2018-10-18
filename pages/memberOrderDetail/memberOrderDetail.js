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
                let detail = res.data
                let dates = detail.activityStartTime.split("~")
                console.log(dates)
                detail.startDate = app.converDate(dates[0])
                detail.endDate = app.converDate(dates[1])
                this.setData({
                    detail: detail,
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
    toDetails(){
        wx.navigateTo({
            url: `/pages/activityDetails/activityDetails?id=${this.data.detail.activityId}`,
        })
    },
    onShow: function() {

    },
    onShareAppMessage: function() {

    }
})