let app = getApp()
Page({
    data: {
        pageLoading: true,
        isOrganizer: false
    },
    onLoad(options) {
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#FF6363',
        })
        app.pageTitle("个人中心")
    },
    getUserInfo(e) {
        this.setData({
            btnLoading: true
        })
        if (e.detail) {
            app.login(e.detail, wx.getStorageSync("CODE"), () => {
                this.setData({
                    member: wx.getStorageSync("login")
                })
            })
        } else {
            app.tip('请您允许授权登录，否则无法使用该App')
        }
    },
    toActivityList() {
        wx.navigateTo({
            url: '/pages/activityList/activityList',
        })
    },
    exitSys() {
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
    toggleRole() {
        let isOrganizer = !this.data.isOrganizer
        wx.setStorageSync("isOrganizer", isOrganizer)

        this.setData({
            isOrganizer: isOrganizer
        })
        this.getMemberInfo(!isOrganizer)
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
    getParticipant() { 
        //参与者
        app.api.getMemberInfo({
            memberId: app.common("memberId"),
            merchantId: app.common("merchantId")
        }).then(res => {
            console.log(res.data)
            this.setData({
                member: res.data
            })
        })
    },
    getSponsor() { 
        //主办方
        app.api.selectData({
            userId: app.common('id')
        }).then(res => {
            console.log(res)
            this.setData({
                member: res.data,
                pageLoading: false
            })
        })
    },
    onShow() {
        this.initMember()
    },
    getMemberInfo(isOrganizer) {
        if (isOrganizer) {
            //参与者
            this.getParticipant()
        } else {
            //主办方
            this.getSponsor()
        }
    },
    //初始化个人中心
    initMember() {
        if (wx.getStorageSync("login")) {
            let isOrganizer = wx.getStorageSync("isOrganizer") || false
            this.setData({
                isOrganizer: isOrganizer,
            })
            this.getMemberInfo(isOrganizer)
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