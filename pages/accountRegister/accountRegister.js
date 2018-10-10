let app = getApp()
Page({
    data: {
        btnLoading: false
    },
    onLoad(options) {
        console.log(options.params)
        let reg = JSON.parse(options.params)
        this.setData({
            reg: reg
        })
        app.pageTitle(`注册${app.ext.appName}`)
    },
    //校验注册
    checkForm(e, cb) {
        if (e.phone === '') {
            app.tip('请输入手机号')
        } else if (e.verificationCode === '') {
            app.tip('请输入验证码')
        } else if (e.password === '') {
            app.tip('请输入密码')
        } else if (!this.checkPassword(e.password)) {
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
                        //cb()
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
        if (!this.checkPhone(e.detail.value)) {
            app.tip("请输入正确的手机号")
        }
    },
    checkPhone(num) {
        let phone = /^[1][3,4,5,7,8][0-9]{9}$/
        return phone.test(num)
    },
    checkPassword(key) {
        let password = /^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/i
        return password.test(key)
    },
    //手机号
    phoneValue(e) {
        let isPass = !this.checkPhone(e.detail.value) ? false : true
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