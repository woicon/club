let app = getApp()
Page({
    data: {
        pageLoading: true,
        role:false
    },
    onLoad: function(options) {
        console.log("onload")
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#FF6363',
        })
        app.pageTitle("个人中心")
    },
    getUserInfo(e) {
        console.log("LOGIN-detail0000::===>", e.detail)
        this.setData({
            btnLoading: true
        })
        if (e.detail) {
            app.login(e.detail, wx.getStorageSync("CODE"), () => {
                this.setData({
                    member: wx.getStorageSync("login")
                })
                this.initMember()
            })
        } else {
            app.tip('请您允许授权登录，否则无法使用该App')
        }

    },


    exitSys: function() {
        wx.showModal({
            title: '提示',
            content: '确定要退出吗？',
            success: res => {
                console.log(res)
                if (res.confirm) {
                    wx.clearStorage()
                    wx.hideTabBar()
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            }
        })
    },
    toggleRole(){
        this.setData({
            role:!this.data.role
        })
    },
    scanCode(e) {
        // wx.showLoading()
        wx.scanCode({
            success: (res) => {
                // wx.hideLoading()
                wx.showLoading({
                    title: '验证码识别中',
                })
                app.api.findSignInfoBySignCode({
                        signCode: res.result,
                    })
                    .then(res => {
                        wx.hideLoading()
                        if (res.status == '200') {
                            wx.setStorageSync("ticketInfo", res.data)
                            wx.navigateTo({
                                url: '/pages/checkTicket/checkTicket',
                            })
                        } else {
                            app.tip(res.msg)
                        }
                    })
            }
        })
    },
    onShow() {
        this.initMember()
    },
    initMember() {
        if (wx.getStorageSync("login")) {
            this.setData({
                members: wx.getStorageSync("login")
            })
            app.api.selectData({
                userId: app.common('id')
            }).then(res => {
                console.log(res)
                this.setData({
                    member: res.data,
                    pageLoading: false
                })
            })
        } else {
            this.setData({
                pageLoading: false
            })
        }
    },
    toPage(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
})