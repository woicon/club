let app = getApp()
Page({
    data: {
        status: ["全部", "进行中", "已关闭", "已删除", "已结束"],
        pageLoading: true,
        currentTab: 0,
        isBottm: false,
        hasMore: true,
        actStatus: {
            0: "进行中",
            1: "已关闭",
            2: "已删除",
            3: "已结束",
        }
    },
    onLoad: function(options) {
        this.getList()
    },
    toggleTab: function(e) {
        let id = e.target.id
        console.log("IDSSSS::",id)
        this.setData({
            currentTab: e.target.id
        })
        id == 0 ? this.getList() : this.getList({ status:id - 1})
    },
    listParmas: function(args) {
        let arg = args || {}
        let parmas = {
            page: 1,
            size: 10,
            merchantId: app.common("merchantid"),
        }
        if (arg.status || arg.status == 0) {
            parmas.status = arg.status
        }
        if (arg.isMore) {
            parmas.page = this.data.page + 1
        } else {
            this.setData({
                pageLoading: true
            })
        }
        return parmas
    },
    getList(args) {
        let arg = args || {}
        let parmas = this.listParmas(arg)
        console.log(parmas)
        app.api.activityList(parmas, "POST")
            .then(res => {
                if (arg.isMore) {
                    if (res.data.length != 0) {
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
                    this.setData({
                        list: res.data,
                        pageLoading: false,
                        page: 1,
                    })
                }
            })
    },
    listMore: function() {
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
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})