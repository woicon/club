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
        let shareParmas = {}
        
        wx.getSystemInfo({
            success: (res)=> {
                console.log(res)
                this.setData({
                    width:res.windowWidth,
                    height:res.windowHeight
                })
            },
        })

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
                let shareImg = res[0].data
                let detail = res[1].data
                if (shareImg.indexOf('51club.com') != -1) {
                    let pant = new RegExp("https://www.51club.com", "g")
                    shareImg = shareImg.replace(pant, "https://www.huodonghui.com")
                }
                res[1].data.startDate = app.converDate(res[1].data.startDate)
                res[1].data.endDate = app.converDate(res[1].data.endDate)
                let img = res[1].data.activityImg

                this.setData({
                    shareImg: shareImg,
                    detail: res[1].data,
                    pageLoading: false,
                    member: wx.getStorageSync("login")
                })
                app.api.getWXACode({
                        scene: `id=${this.data.detail.id}&isShare=true`,
                        page: `pages/acitivityDetails/acitivityDetails`,
                        width: 430
                    })
                    .then(res => {
                        console.log(res)
                    })

            })
    },
    
    drawPost(arg) {

        ctx.scale(.5, .5)
        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 0, 600, 850)
        ctx.draw(true)
        //海报
        drawimg(arg.img, (img) => {
            ctx.drawImage(img, 0, 0, 600, 350)
            ctx.draw(true)
        })
        //二维码
        drawimg("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539859954145&di=9d411ec610d3de63b20e338943cedce6&imgtype=0&src=http%3A%2F%2Fimg.58cdn.com.cn%2Fds%2Fcategory%2Fererima_new.jpg", (img) => {
            ctx.drawImage(img, 200, 560, 200, 200)
            ctx.draw(true)
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

        function drawimg(imgPath, callback) {
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
    },
    onReady: function() {

    }
})