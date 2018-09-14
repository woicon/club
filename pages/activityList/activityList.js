let app = getApp()
Page({
    data: {
        status: ["全部", "进行中", "已关闭", "已删除", "已结束"],
        pageLoading: true,
        currentTab: 0,
        isBottm: false,
        hasMore: true,
        pageLoading: true,
        actStatus: {
            0: "进行中",
            1: "已关闭",
            2: "已删除",
            3: "已结束",
        },
        statusType: -1
    },
    onLoad(options) {
        app.pageTitle("活动管理")
    },
    getUserInfo(e) {
        console.log("LOGIN-detail0000::===>", e.detail)
        if (e.detail) {
            app.login(e.detail, wx.getStorageSync("CODE"), () => {
                this.setData({
                    member: wx.getStorageSync("login")
                })
                this.getList()
            })
        } else {
            app.tip('请您允许授权登录，否则无法使用该App')
        }
        this.setData({
            btnLoading: true
        })
    },
    toggleTab(e) {
        let id = e.currentTarget.id
        this.setData({
            currentTab: e.target.id,
            hasMore: true
        })
        this.setData({
            statusType: id - 1
        })
        this.getList()
    },
    listParams(args) {
        let arg = args || {}
        let params = {
            page: 1,
            size: 8,
            merchantId: app.common('merchantId'),
        }
        if (this.data.statusType != -1) {
            params.status = this.data.statusType
        }
        if (arg.isMore) {
            params.page = this.data.page + 1
        } else {
            this.setData({
                scrollLoading: true
            })
        }
        return params
    },
    getList(args) {
        let arg = args || {}
        let parmas = this.listParams(arg)
        console.log(parmas)
        app.api.activityList(parmas)
            .then(res => {
                if (arg.isMore) {
                    if (res.data.length > 0) {
                        let list = this.data.list
                        list = list.concat(res.data)
                        this.setData({
                            list: list,
                            page: this.data.page + 1
                        })
                    } else {
                        this.setData({
                            hasMore: false,
                        })
                    }
                } else {
                    let hasMore = res.data.length < 8 ? false : true
                    this.setData({
                        list: res.data,
                        scrollLoading: false,
                        pageLoading: false,
                        page: 1,
                        hasMore: hasMore
                    })
                }
            })
    },
    listMore() {
        this.setData({
            isBottom: true
        })
        if (this.data.hasMore) {
            this.getList({
                isMore: true,
            })
        }
    },
    toManagement(e) {
        wx.setStorageSync("actManagement", this.data.list[e.currentTarget.dataset.index])
        wx.navigateTo({
            url: '/pages/activityManagement/activityManagement',
        })
    },
    onShow() {
        if (wx.getStorageSync("login")) {
            console.log("IsLogin::===>", wx.getStorageSync("login"))
            this.setData({
                member: wx.getStorageSync("login"),
            })
            this.getList()
        } else {
            this.setData({
                member: null,
                pageLoading: false
            })
        }
    }
})