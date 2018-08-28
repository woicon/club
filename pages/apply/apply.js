// pages/apply/apply.js
var api = require('../../api/api.js')
Page({
    data: {
        listLoad: true,
        hasMore: true
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '用户信息',
        })
        this.getList()
    },
    getList: function(loadMore) {
        let id = wx.getStorageSync("detailId")
        let parmas = {
            activityId: id,
            count: 20,
            page: 1,
            // keyWord: '23'
        }
        if (loadMore) {
            parmas.page = this.data.list.currentPage + 1
        }
        api.activityEnrollList(parmas)
            .then(res => {
                console.log(res)
                let result = res.result
                if (res.code == 0) {
                    if (loadMore) {
                        if (result.contactList.length != 0) {
                            let list = this.data.list
                            list.currentPage = result.currentPage
                            list.contactList = list.contactList.concat(res.result.contactList)
                            this.setData({
                                list: list,
                                toBottom: false,
                                listLoad: false
                            })
                        } else {
                            this.setData({
                                hasMore: false
                            })
                        }
                    } else {
                        this.setData({
                            list: res.result,
                            listLoad: false
                        })
                    }
                }
            })
    },
    viewCard: function(e) {
        console.log(e)
        let card = this.data.list.contactList[e.currentTarget.id]
        this.setData({
            card: card,
            viewCard: true,
            cardId: e.currentTarget.id
        })
    },
    closeCard: function() {
        this.setData({
            viewCard: false
        })
    },
    checkAction: function(e) {
        console.log(e)
        wx.showLoading()
        let parmas = {
            activityId: wx.getStorageSync("detailId"),
            code: e.currentTarget.dataset.code
        }
        let list = this.data.list
        api.verification(parmas)
            .then(res => {
                console.log(res)
                wx.hideLoading()
                if (res.code == -1) {
                    wx.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                } else if (res.code == 0) {
                    list.contactList[this.data.cardId || e.currentTarget.dataset.index].verificationStatus = 2
                    let data = {
                        list: list,
                        viewCard: false
                    }
                    if (this.data.card) {
                        let card = this.data.card
                        card.verificationStatus = 2
                        data.card = card
                    }
                    this.setData(data)
                    wx.showToast({
                        title: "签到成功",
                        icon: 'none'
                    })
                }
            })
    },
    scrollMore: function() {
        this.setData({
            toBottom: true
        })
        if (this.data.hasMore) {
            this.getList(true)
        }
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

    onShareAppMessage: function() {

    }
})