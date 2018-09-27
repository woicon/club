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
        hasMore: true,
        replyTxt: "",
    },
    onLoad: function(options) {
        this.messageList()
        wx.setNavigationBarTitle({
            title: '留言管理',
        })
    },
    toggleTab: function(e) {
        this.setData({
            currentTab: e.target.id,
            hasMore: true,

        })
        this.messageList({
            isToggle: true
        })
    },
    listParams(arg) {
        arg = arg || {}
        let params = {
            page: arg.page || 1,
            pcount: 15,
            status: this.data.currentTab,
            userId:app.common("id"),
        }
        return params
    },
    messageReply(e) {
        console.log(e)
        this.setData({
            activeMsg: this.data.message[e.currentTarget.dataset.index]
        })
    },
    clearReply() {
        this.setData({
            activeMsg: null
        })
    },
    messageList: function(arg) {
        arg = arg || {}
        if (!arg.isMore) {
            this.setData({
                pageLoading: true
            })
        }
        app.api.messageList(this.listParams(arg))
            .then(res => {
                console.log(res)
                let hasMore = (res.data) ? true : false
                let page
                let message
                if (res.status == '200') {
                    if (arg.isMore) {
                        let _list = this.data.message
                        message = _list.concat(res.data)
                        page = this.data.page + 1
                    } else {
                        message = res.data
                        page = 1
                    }
                    this.setData({
                        pageLoading: false,
                        message: message,
                        page: page,
                        hasMore: hasMore
                    })
                } else {
                    if (arg.isMore) {
                        this.setData({
                            hasMore: false,
                            pageLoading: false,
                        })
                    } else {
                        this.setData({
                            hasMore: false,
                            pageLoading: false,
                            message: null,
                        })
                    }
                }
            })
    },
    inputContent: function(e) {
        this.setData({
            replyTxt: e.detail.value
        })
    },
    replyMsg: function(e) {
        console.log(e)
        let params = {
            content: this.data.replyTxt,
            merchantId: app.common('merchantId'),
            messageId: e.target.dataset.id,
        }
        console.log(this.data.replyTxt === '')
        if (this.data.replyTxt === '') {
            app.tip("请输入回复内容！")
        } else {
            app.api.messageReply(params)
                .then(res => {
                    console.log(res)
                    if (res.status == '200') {
                        app.tip(res.data)
                        this.messageList()
                        this.setData({
                            activeMsg: null
                        })
                    }
                })
        }
    },
    listMore(e) {
        this.setData({
            isBottom: true,
        })
        if (this.data.hasMore) {
            this.messageList({
                page: this.data.page + 1,
                isMore: true
            })
        }
    },
    onShareAppMessage: function() {

    }
})