let app = getApp()
Page({
    data: {

    },
    onLoad: function(options) {
        app.checkLogin()
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
    toDateSet() {
        wx.navigateTo({
            url: '/pages/dataSet/dataSet',
        })
    },
    scanCode(e) {
        wx.showLoading()
        wx.scanCode({
            success: (res) => {
                wx.hideLoading()
                console.log(res.result)
            }
        })
    },
    authorizeInfo() {
        wx.navigateTo({
            url: '/pages/authorizeInfo/authorizeInfo',
        })
    }
})