// pages/applySuccess/applySuccess.js
let app = getApp()
Page({
    data: {
        pageLoading:true
    },
    onLoad: function(option) {
        app.pageTitle("报名提交成功")
        let form = wx.getStorageSync("form")
        if (option.id != undefined) {
            app.api.myOrderDetail({
                orderId: option.id,
                activityId: form.activityId
            }).then((res) => {
                this.setData({
                    detail: res.data,
                    pageLoading:false
                })
            })
        }

    },
    lookOrder() {
        wx.navigateTo({
            url: `/pages/memberOrderDetail/memberOrderDetail?orderId=${this.data.detail.id}&activityId=${this.data.detail.activityId}`,
        })
    },
    continues() {
        wx.switchTab({
            //url: `/pages/activityDetails/activityDetails?id=${this.data.activityId}`,
            url: `/pages/index/index`
        })
    },
    callBuiness() {
        wx.makePhoneCall({
            phoneNumber: this.data.detail.contactsPhone
        })
    }
})