let app = getApp()
Page({
    data: {
        btnLoading: false
    },
    onLoad(options) {
        app.pageTitle(`完善账户信息`)
    },
    //校验注册
    checkForm(e, cb) {
        if (e.phone === '') {
            app.tip('请输入手机号')
        } else if (e.verificationCode === '') {
            app.tip('请输入验证码')
        } else if (e.password === '') {
            app.tip('请输入密码')
        } else if (!app.check.password(e.password)) {
            app.tip("请输入6到20位密码")
        } else {
            cb()
        }
    },
    //注册
    registerAccount(e) {
        this.checkForm(e.detail.value, () => {
            this.setData({
                btnLoading: true
            })
            let params = Object.assign(wx.getStorageSync("reg"), e.detail.value)
            app.api.wechatRegister(params)
                .then(res => {
                    console.log(res)
                    wx.hideLoading()
                    if (res.status === '200') {
                        wx.setStorageSync("login", res.data)
                        app.tip("注册成功")
                        wx.navigateBack()
                    } else {
                        app.tip(res.msg)
                    }
                    this.setData({
                        btnLoading: false
                    })
                })
        })
    },
    phoneBlur(e) {
        if (!app.check.phone(e.detail.value)) {
            app.tip("请输入正确的手机号")
        }
    },

    //手机号
    phoneValue(e) {
        let isPass = !app.check.phone(e.detail.value) ? false : true
        this.setData({
            isPass: isPass,
            phoneValue: e.detail.value
        })
    },
    //获取验证码
    getCodes(e) {
        wx.showLoading()
        app.api.sendVerifyCode({
                merchantId: app.ext.merchantId,
                superMerchantId: app.ext.merchantId,
                mobilePhone: this.data.phoneValue
            })
            .then(res => {
                console.log(res)
                wx.hideLoading()
                if (res.status = '200') {
                    app.tip(`验证短信${res.data.resultDesc}`)
                    for (let i = 0; i <= 120; i++) {
                        setTimeout(() => {
                            this.setData({
                                isPass: false,
                                phoneDone: true,
                                endTime: 120 - i
                            });
                            if (this.data.endTime == 0) {
                                this.setData({
                                    isPass: true,
                                    phoneDone: false,
                                    endTime: 120
                                });
                            }
                        }, i * 1000)
                    }
                    this.setData({
                        waitGetCode: true,
                        applyProgressKey: res.data.applyProgressKey
                    })
                } else {
                    app.tip(res.msg)
                }
            })
    },
    codeInput(e) {
        this.setData({
            phoneCode: e.detail.value
        })
    }
})