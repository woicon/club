let app = getApp()
Page({
    data: {

    },
    onLoad: function(options) {
        app.checkLogin()
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#FF6363',
        })
        app.pageTitle("个人中心")
        if (wx.getStorageSync("login")) {
            this.setData({
                member: wx.getStorageSync("login")
            })
            app.api.selectData({
                userid: app.common('id')
            }).then(res => {
                console.log(res)
                this.setData({
                    data: res.data
                })
            })
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
    scanCode(e) {
       // wx.showLoading()
        wx.scanCode({
            success: (res) => {
               // wx.hideLoading()
                console.log(res.result)
            }
        })
    },
    toPage(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
})