let app = getApp()
Page({
    data: {},
    onLoad: function(options) {
        app.pageTitle("票券审核")
        this.setData({
            ticket: wx.getStorageSync("ticketInfo")
        })
    },
    checkTicket() {
        let ticket = this.data.ticket
        app.api.verificationTicketByOrderId({
                orderId: ticket.id,
                employeeId: ticket.merchantId,
                employeeName: ticket.merchantName,
                signCode: ticket.signCode
            })
            .then(res => {
                console.log(res)
                if (res.status == '200') {
                    this.setData({
                        res: true,
                        info: res.data
                    })
                    app.tip(res.data)
                } else if (res.status == '1006' || res.status == '1000') {
                    this.setData({
                        res: true,
                        info: res.msg,
                        error: true
                    })
                    app.tip(res.data)
                }
            })
    },
    scanCode() {
        wx.scanCode({
            success: (res) => {
                console.log(res)
                wx.showLoading({
                    title: '识别中',
                })
                app.api.findSignInfoBySignCode({
                        signCode: res.result,
                    })
                    .then(res => {
                        wx.hideLoading()
                        if (res.status == '200') {
                            wx.setStorageSync("ticketInfo", res.data)
                            this.setData({
                                ticket: res.data,
                                res: false
                            })
                        } else {
                            app.tip(res.msg)
                        }
                    })
            }
        })
    },
    onReady: function() {

    },

})