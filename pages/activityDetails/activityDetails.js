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
        pageLoading: true,
        userInfo: null
    },
    createActivity() {
        wx.switchTab({
            url: '/pages/newActivity/newActivity',
        })
    },
    getUserInfo(e) {
        this.setData({
            btnLoading: true
        })
        wx.setStorageSync("applyDetail", this.data.detail)
        wx.setStorageSync("applyReg", true)
        let detail = e.detail
        console.log(detail)
        if (detail.userInfo) {
            this.setData({
                userInfo: detail
            })
        } else {
            this.setData({
                btnLoading: false
            })
            app.tip('请您允许授权登录，否则无法使用该App')
        }
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
    register(e) {
        let detail = e.detail
        if (detail) {
            this.setData({
                btnLoading: false,
                member: e.detail
            })
            wx.setStorageSync("login", e.detail)
            this.toApply()
        } else {
            this.setData({
                btnLoading: false
            })
        }
    },
    toApply() {
        wx.setStorageSync("applyDetail", this.data.detail)
        wx.navigateTo({
            url: '/pages/activityApply/activityApply',
        })
    },
    onLoad(options) {
        console.log("活动详情参数===>", options)
        this.setData({
            isPX: app.isPX,
            id: options.id,
            isShare: !!options.isshare
        })
    },
    onShow() {
        this.setData({
            userInfo: null
        })
        app.isLogin()
        this.getDetail(this.data.id)
    },
    onShareAppMessage() {
        return {
            title: this.data.detail.activityName,
            path: `/pages/activityDetails/activityDetails?id=${this.data.detail.id}&isshare=true`,
            imageUrl: `${this.data.detail.activityImg}`
        }
    },
    goHome() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    }
})