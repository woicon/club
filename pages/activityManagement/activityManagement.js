let app = getApp()
Page({
    data: {
        actStatus: {
            0: "进行中",
            1: "已关闭",
            2: "已删除",
            3: "已结束",
        },
        pageLoading: true
    },
    onLoad: function(options) {
        let detail = wx.getStorageSync("actManagement")
        this.setData({
            detail: detail
        })
    },
    actDetail() {
        app.api.activityDetail({
            id: this.data.detail.id
        }).then((res) => {
            this.setData({
                detail: res.data,
                pageLoading: false
            })
            app.pageTitle(res.data.activityName)
        })
    },
    onShow:function(){
        this.actDetail()
    },
    toUrl(url) {
        wx.navigateTo({
            url: `${url}?activityId=${this.data.detail.id}&merchantId=${this.data.detail.merchantId}&activityName=${this.data.detail.activityName}`
        })
    },
    toShare(e) {
        console.log(e)
        this.toUrl("/pages/activityShare/activityShare")
    },
    enrollList(e) {
        this.toUrl("/pages/activityOrderEnrollList/activityOrderEnrollList")
    },
    orderList(e) {
        this.toUrl("/pages/activityOrderList/activityOrderList")
    },
    toDetail(e) {
        this.toUrl("/pages/activityDetail/activityDetail")
    },
    toEdit(e) {
        let status = this.data.detail.status
        if (status == 3) {
            app.tip("活动已结束，不允许编辑")
        } else if (status == 0) {
            wx.setStorageSync("editActivity", this.data.detail)
            this.toUrl("/pages/creatActivity/creatActivity?edit=true")
        }
    },
    onShareAppMessage: function() {

    }
})