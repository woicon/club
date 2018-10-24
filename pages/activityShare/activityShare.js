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
    onLoad(options) {
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
                    path: `/pages/activityDetails/activityDetails?id=${detail.id}&isShare=true`,
                    activityId: detail.id,
                    width: 430
                }
                app.api.getWXACode(qrParams)
                    .then(qrImg => {
                        this.setData({
                            qrImg: qrImg,
                            detail: detail,
                            pageLoading: false,
                            member: wx.getStorageSync("login")
                        })
                    })
            })
    },

    drawPost(arg) {
        let w, h, ih
        wx.getSystemInfo({
            success: (res) => {
                w = Math.ceil(res.windowWidth * .84 * 2)
                console.log(w)
                w = w % 2 == 0 ? w : w + 1
                h = Math.ceil(res.windowHeight * .84 * 2)
                ih = w * (w/h)
            },
        })
        this.setData({
            imgWidth: w,
            imgHeight: h,
            imgh: ih + 150 + 180 + 40 +110
        })
        wx.showLoading()
        //缩放
        ctx.scale(.5, .5)
        //海报
        drawimg(arg.img, (img) => {
            ctx.drawImage(img, 0, 0, w, ih)
            ctx.draw(true)
            wx.hideLoading()
        })
        ctx.setTextAlign('center')

        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 0, w, ih + 150 + 180 + 140 + 110)
        ctx.draw(true)

        //活动标题
        ctx.setFontSize(34)
        ctx.setFillStyle('#333333')

        var temp = ""
        var row = []

        let chr = arg.title.split("")
        for (var a = 0; a < chr.length; a++) {
            if (ctx.measureText(temp).width < w - 100) {
                temp += chr[a]
            } else {
                a--
                row.push(temp)
                temp = ""
            }
        }
        row.push(temp)
        if (row.length > 2) {
            var rowCut = row.slice(0, 2)
            var rowPart = rowCut[1]
            var test = ""
            var empty = []
            for (var a = 0; a < rowPart.length; a++) {
                if (ctx.measureText(test).width < w - 100) {
                    test += rowPart[a]
                } else {
                    break
                }
            }
            empty.push(test)
            var group = empty[0] + "..."
            rowCut.splice(1, 1, group)
            row = rowCut
        }
        let hb
        for (var b = 0; b < row.length; b++) {
            hb = b * 44
            ctx.fillText(row[b], w / 2, ih + 70 + hb, w-70)
            ctx.draw(true)
        }

        //活动时间
        ctx.setFontSize(22)
        ctx.setFillStyle('#888888')
        ctx.fillText(arg.time, w / 2, ih + 110 + hb)
        ctx.draw(true)
        //二维码
        drawimg(this.data.qrImg, (img) => {
            ctx.drawImage(img, ((w - 180) / 2), ih + 200 + hb, 180, 180)
            ctx.draw(true)
            wx.hideLoading()
        })
        //长按识别二维码
        ctx.setFontSize(20)
        ctx.setFillStyle('#999999')
        ctx.fillText("长按识别二维码", w / 2, ih + 200 + 180 + 30+ hb)
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
                            console.log(img)
                            callback(res.tempFilePath)
                        }
                    })
                }
            })
        }

    },
    saveShare(init) {
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
                console.log(res)
                if (init) {
                    this.setData({
                        shareImg: res.tempFilePath,
                    })
                }
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
            path: `/pages/activityDetails/activityDetails?id=${this.data.detail.id}&isshare=true`,
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