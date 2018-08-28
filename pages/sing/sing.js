const app = getApp()
var api = require('../../api/api.js')
Page({
    data: {
        // 开始角度
        startAngle: -(1 / 2 * Math.PI),
        // 偏移角度
        xAngle: Math.PI / 180
    },

    onLoad: function(options) {
        console.log(options)
        wx.setNavigationBarTitle({
            title: options.title,
        })

        api.attendanceRate({
                activityId: options.id
            })
            .then(res => {
                let check = res.result
                let x = check.total == 0 ? 1 : (check.checkCount / check.total) * 100
                let endAngle = (x * 3.6 - 90) * Math.PI / 180
                this.setData({
                    check: check,
                    endAngle: endAngle
                })
                this.drawArc(endAngle)
            })
    },
    drawArc: function(endAngle) {
        const ctx = wx.createCanvasContext('myCanvas')
        // Draw arc
        ctx.beginPath()
        ctx.arc(65, 65, 60, -90 * Math.PI, (100 - 90) * Math.PI)
        ctx.setLineWidth(10)
        ctx.setStrokeStyle("#323dad")
        ctx.stroke()
        ctx.draw()
        var cxt_arc = wx.createContext()
        var xAngle = this.data.xAngle
        var templeAngle = this.data.startAngle

        let rander = () => {
            if (templeAngle >= endAngle) {
                return;
            } else if (templeAngle + xAngle > endAngle) {
                templeAngle = endAngle;
            } else {
                templeAngle += xAngle
            }
            cxt_arc.beginPath();
            cxt_arc.setStrokeStyle('#ffffff')
            // cxt_arc.arc(65, 65, 60, -(1 / 2 * Math.PI), templeAngle)
            cxt_arc.arc(65, 65, 60, -90 * Math.PI / 180, endAngle)
            cxt_arc.setLineWidth(10)
            cxt_arc.lineCap = 'round'
            cxt_arc.stroke()
            cxt_arc.closePath()
            wx.drawCanvas({
                canvasId: 'myCanvas',
                actions: cxt_arc.getActions()
            })
            // requestAnimationFrame(rander);
        }
        rander()


    },

    checkSing: function() {
        wx.scanCode({
            success: data => {
                api.verification({
                        code: data.result,
                        activityId: wx.getStorageSync("detailId")
                    })
                    .then(res => {
                        if(res.code == -1){
                            wx.showToast({
                                title: res.message,
                                icon:'ok'
                            })
                        }else if(res.code == 0) {
                            wx.showToast({
                                title: res.message,
                                icon:"ok"
                            })
                            wx.setStorageSync("checkDetail",res.result)
                            wx.navigateTo({
                                url: '/pages/checkDetail/checkDetail',
                            })
                        }
                    })
            }
        })
    },
    viewDetail: function() {
        wx.navigateTo({
            url: '/pages/detail/detail',
        })
    },
    viewApply: function() {
        wx.navigateTo({
            url: '/pages/apply/apply',
        })
    },
    onReady: function() {

    },

    onShow: function() {

    },

    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})