let app = getApp()
Page({
    data: {
        status: {
            1: "未回复",
            2: "已回复",
        },
        currentTab: 1,
        message: null,
        pageLoading: true,
    },
    onLoad: function(options) {
        this.messageList()
        wx.setNavigationBarTitle({
            title: '留言管理',
        })
    },
    toggleTab: function(e) {
        this.setData({
            currentTab: e.target.id
        })
        this.messageList()
    },
    parmas: function() {
        let parmas = {
            page: 1,
            pcount: 30,
            status: this.data.currentTab,
            userid: app.common("id"),
        }
        return parmas
    },
    messageReply(e) {
        console.log(e)
        this.setData({
            activeMsg: this.data.message[e.target.dataset.index]
        })
    },
    clearReply() {
        this.setData({
            activeMsg: null
        })
    },
    messageList: function(args) {
        let arg = args || {}
        if (!arg.isMore) {
            this.setData({
                pageLoading: true
            })
        }
        app.api.messageList(this.parmas())
            .then(res => {
                console.log(res)
                this.setData({
                    pageLoading: false,
                    message: res.data
                })
            })
    },
    inputContent: function(e) {
        this.setData({
            replyTxt: e.detail.value
        })
    },
    replyMsg(e) {
        console.log(e)
        let parmas = {
            content: this.data.replyTxt,
            merchantId: app.common('merchantid'),
            messageId: e.target.dataset.id,
        }
        if (this.data.replyTxt != '') {
            app.api.messageReply(parmas)
                .then(res => {
                    console.log(res)
                })
        }
    },
    onShareAppMessage: function() {

    }
})