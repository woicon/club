let app = getApp()
const ctx = wx.createCanvasContext('shareImg')
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
        console.log("options==>", options)
        app.pageTitle(options.public ? '发布成功' : "分享活动")
        this.setData({
            isPublic: options.public || null
        })
        let detailParams = {
            id: options.public || options.activityId
        }
        app.api.activityDetail(detailParams, 'POST')
            .then(res => {
                let detail = res.data
                detail.startDate = app.converDate(detail.startDate)
                detail.endDate = app.converDate(detail.endDate)
                let qrParams = {
                    path: `pages/acitivityDetails/acitivityDetails?id=${detail.id}&isShare=true`,
                    activityId: detail.id,
                    width: 430
                }
                app.api.getWXACode(qrParams)
                    .then(qrImg => {
                        this.setData({
                            qrImg: qrImg,
                            detail: detail,
                            pageLoading: false,
                            member:wx.getStorageSync("login")
                        })
                    })
            })
    },

    drawPost(arg) {
        wx.showLoading()
        ctx.scale(.5, .5)
        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 0, 600, 850)
        ctx.draw(true)
        //海报
        drawimg(arg.img, (img) => {
            ctx.drawImage(img, 0, 0, 600, 350)
            ctx.draw(true)
            wx.hideLoading()
        })
        //二维码
        drawimg(this.data.qrImg, (img) => {
            ctx.drawImage(img, 200, 560, 200, 200)
            ctx.draw(true)
            wx.hideLoading()
        })
        ctx.setTextAlign('center')
        ctx.setFontSize(35)
        ctx.setFillStyle('#333333')
        ctx.fillText(arg.title, 300, 450)
        ctx.setFontSize(22)
        ctx.setFillStyle('#888888')
        ctx.fillText(arg.time, 300, 500)
        ctx.setFontSize(20)
        ctx.setFillStyle('#999999')
        ctx.fillText("长按识别二维码", 300, 800)
        ctx.draw(true)
        wx.hideLoading()
        
        function drawimg(imgPath, callback) {
            wx.showLoading()
            wx.downloadFile({
                url: imgPath,
                success: (res) => {
                    wx.getImageInfo({
                        src: res.tempFilePath,
                        success: (img) => {
                            callback(res.tempFilePath)
                        }
                    })
                }
            })
        }
    },
    saveShare() {
        wx.canvasToTempFilePath({
            canvasId: 'shareImg',
            success: (res) => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (data) => {
                        wx.showModal({
                            title: '保存成功',
                            content: '图片已保存到相册，快去发布朋友圈吧！',
                            showCancel: false,
                            confirmText: "我知道了"
                        })
                    }
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
        }, this)
    },

    shareGroup() {
        this.setData({
            mask: true,
        })
        let detail = this.data.detail
        this.drawPost({
            img: detail.activityImg,
            title: detail.activityName,
            time: `${detail.startDate} 至 ${detail.endDate}`
        }, 1000)

    },
    toDetail(e) {
        wx.setStorageSync("detailPageUrl", this.data.detail.activityDetailUrl)
        wx.navigateTo({
            url: `/pages/activityDetails/activityDetails?id=${e.currentTarget.dataset.id}`,
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
        console.log(res)
        if (res.from === 'button') {
            this.setData({
                isPublic: null
            })
            console.log(res.target)
        }
        return {
            title: this.data.detail.activityName,
            path: `/pages/activityDetails/activityDetails?id=${this.data.detail.id}&isShare=true`,
            imageUrl: `${this.data.detail.activityImg}`
        }
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
    }
})