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
                this.getMemberInfo(wx.getStorageSync("isOrganizer"))
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
        wx.showLoading({
            title: `切换为${isOrganizer?"主办方":"参与者"}`,
        })
        this.setData({
            isOrganizer: isOrganizer
        })
        this.getMemberInfo(isOrganizer)
    },
    scanCode(e) {
        wx.scanCode({
            success: (res) => {
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
    memberInfo() {
        //参与者
        app.api.getMemberInfo({
            memberId: app.common("memberId"),
            merchantId: app.common("merchantId")
        }).then(res => {
            wx.hideLoading()
            this.setData({
                member: res.data,
                pageLoading: false
            })
        })
    },
    organizerInfo() {
        //主办方
        app.api.selectData({
            userId: app.common('id')
        }).then(res => {
            wx.hideLoading()
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
        isOrganizer ? this.organizerInfo() : this.memberInfo()
    },
    //初始化个人中心
    initMember() {
        let isOrganizer = wx.getStorageSync("isOrganizer")
        if (wx.getStorageSync("login")) {
            this.setData({
                isOrganizer: isOrganizer,
            })
            this.getMemberInfo(isOrganizer)
        } else {
            wx.setStorageSync("isOrganizer", false)
            this.setData({
                pageLoading: false
            })
        }
    },
    onShareAppMessage(e){
        return {
            title: '活动吧助手-您的活动好帮手',
            path: '/pages/index/index',
            imageUrl:"https://tclub.lx123.com/imgPath//club/activity/1539586281868.jpg",
        }
    },
    toPage(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
})