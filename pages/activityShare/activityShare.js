let app = getApp()
Page({
    data: {
        pageLoading: true,
        shareGroup: false,
        actStatus: {
            0: "进行中",
            1: "已关闭",
            2: "已删除",
            3: "已结束",
        }
    },
    onLoad: function(options) {
        console.log(options)
        app.pageTitle(options.public ? '发布成功' : "分享活动")
        this.setData({
            isPublic: options.public || null
        })
        let shareParmas = {}
        if (options.public) {
            shareParmas = {
                activityId: options.public,
                merchantId: app.common("merchantId")
            }
        } else {
            shareParmas = options
        }
        Promise.all([app.api.activityShare(shareParmas, 'POST'), app.api.activityDetail({
                id: options.public || options.activityId
            }, 'POST')])
            .then(res => {
                console.log(res)
                this.setData({
                    shareImg: res[0].data,
                    detail: res[1].data,
                    pageLoading: false,
                    member: wx.getStorageSync("login")
                })
            })
    },
    shareGroup() {
        this.setData({
            mask: true,
        })
    },
    toDetail() {
        wx.setStorageSync("detailPageUrl", this.data.detail.activityDetailUrl)
        wx.navigateTo({
            url: `/pages/activityDetail/activityDetail`,
        })
    },
    shareWe: function() {
        wx.showShareMenu({
            showShareMenu: true,
            success: function() {
                wx.showToast({
                    title: '转发成功',
                    icon: 'none'
                })
            }
        })
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            this.setData({
                isPublic: null
            })
            console.log(res.target)
        }
        return {
            title: this.data.detail.activityName,
            // path: `${app.ext.host}m/${this.data.detail.merchantId}_1/detail.htm?id=${this.data.detail.id}`
            path: `/pages/activityDetail/activityDetail?merchantId=${this.data.detail.merchantId}&activityId=${this.data.detail.id}&activityName=${this.data.detail.activityName}`
        }
    },
    saveShare: function(e) {
        console.log(e)
        wx.getImageInfo({
            src: this.data.shareImg,
            success: (res) => {
                console.log(res)
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: (res) => {
                        console.log(res)
                        this.setData({
                            toAuth: false
                        })
                        wx.showModal({
                            title: '保存成功',
                            content: '图片已保存到相册，快去发布朋友圈吧！',
                            showCancel: false,
                            confirmText: "我知道了"
                        })
                    },
                    fail: (error) => {
                        console.log(error)
                        if (error.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
                            this.setData({
                                toAuth: true
                            })
                        }
                    }
                })
            }
        })

    },
    handleSetting(e) {
        console.log(e)
        if (!e.detail.authSetting['scope.writePhotosAlbum']) {
            this.setData({
                toAuth: true
            })
        } else {
            this.saveShare()
            this.setData({
                toAuth: false
            })
        }
    },
    closeGroup: function() {
        this.setData({
            mask: false
        })
    },
    onReady: function() {

    }
})