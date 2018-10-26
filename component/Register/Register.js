// component/Register.js
let app = getApp()
Component({
    properties: {
        userInfo: {
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
            observer: function(newVal, oldVal, changedPath) {}
        }
    },
    options: {
        addGlobalClass: true,
    },
    data: {
        btnLoading: false,
    },
    methods: {
        getSessionKey() {
            return new Promise((res, e) => {
                wx.login({
                    success: (login) => {
                        wx.request({
                            url: `${app.ext.host}api/wechatAppSessionApplet.htm`,
                            data: {
                                appId: app.ext.appId,
                                jsCode: login.code,
                                system: '51club'
                            },
                            success: (session) => {
                                console.log(session)
                                if (session.data.code === 0) {
                                    res(session.data.result)
                                } else {
                                    app.tip(session.data.message)
                                    this.setData({
                                        btnLoading: false
                                    })
                                }
                            },
                            fail: (error) => {
                                rej(error)
                            }
                        })
                    }
                })
            })
        },
        getUserInfo(e) {
            this.setData({
                btnLoading: true
            })
            let detail = e.detail
            if (detail.userInfo) {
                this.setData({
                    userInfo: detail,
                    btnLoading: false
                })
            } else {
                this.setData({
                    btnLoading: false
                })
                app.tip('请您允许授权登录，否则无法使用该App')
            }
        },
        getPhoneNumber(e) {
            console.log(e)
            this.setData({
                btnLoading: true
            })
            let detail = e.detail
            if (detail.iv) {
                this.getSessionKey()
                    .then(session => {
                        //手机号注册
                        app.api.wechatPhone({
                            encryptedData: detail.encryptedData,
                            iv: detail.iv,
                            sessionKey: session.session_key
                        }).then(phone => {
                            if (phone.status == '200') {
                                app.api.wechatRegister({
                                    encryptedData: this.data.userInfo.encryptedData,
                                    iv: this.data.userInfo.iv,
                                    superiorMerchantId: app.ext.merchantId,
                                    phone: phone.data,
                                    sessionKey: session.session_key
                                }).then(member => {
                                    console.log(member)
                                    this.setData({
                                        member: member.data
                                    })
                                    var myEventOption = {}
                                    this.triggerEvent('register', member.data, myEventOption)
                                })
                            } else {
                                app.tip("获取手机号失败！")
                            }
                        })
                    })
            } else {
                app.tip("拒绝授权将无法注册使用该App全部功能")
                this.setData({
                    btnLoading: false
                })
            }
        }
    }
})