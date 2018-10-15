let app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
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
    createActivity(){
        wx.switchTab({
            url: '/pages/newIndex/newIndex',
        })
    },
    getDetail(id) {
        let params = {
            id: id
        }
        //主办方不传 memberId
        if (!wx.getStorageSync("isOrganizer") && wx.getStorageSync("login")) {
            params.memberId = app.common("memberId")
        }
        app.api.activityDetail(params).then(res => {
            if (res.status == '200') {
                this.detailParse(res.data.activityDetails)
                let detail = res.data
                detail.startDate = app.converDate(detail.startDate)
                detail.endDate = app.converDate(detail.endDate)
                app.pageTitle(detail.activityName)
                this.setData({
                    detail: detail,
                    pageLoading: false,
                })
            } else {
                app.tip(res.msg)
                this.setData({
                    pageLoading: false,
                })
            }
        })
    },
    detailParse(detail) {
        WxParse.wxParse('article', 'html', detail, this, 5)
    },
    toMap(e) {
        console.log(e)
        let params = e.currentTarget.dataset
        wx.openLocation({
            latitude: Number(params.lat),
            longitude: Number(params.lon),
            address: params.address,
        })
    },
    toApply() {
        wx.setStorageSync("applyDetail", this.data.detail)
        wx.navigateTo({
            url: '/pages/activityApply/activityApply',
        })
    },
    onLoad(options) {
        this.setData({
            isPX: app.isPX,
            id: options.id
        })
    },
    onShow() {
        console.log(app)
        this.getDetail(this.data.id)
    },
    onShareAppMessage: function() {

    }
})