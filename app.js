var api = require('newApi/newApi.js')
var app = getApp()
var types = require('utils/types.js')
var base = require('utils/util.js')
App({
    onLaunch(options) {
        let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
        this.updateManager()
        this.ext = extConfig
        this.api = api(extConfig.host)
        this.check = base.check
        this.types = types
        this.isPx()
        wx.setStorageSync("ext", extConfig)
        console.log("EXT.JSON==>Version::" + this.version, extConfig)
        wx.login({
            success: (res) => {
                wx.setStorageSync("CODE", res.code)
            }
        })
    },
    version: "1.1",
    globalData: {
        userInfo: null
    },
    currPage: function() {
        let _curPageArr = getCurrentPages()
        return _curPageArr[_curPageArr.length - 1]
    },
    checkLogin() {
        let currPage = this.currPage()
        let _currPage = currPage
        wx.setStorageSync("backUrl", '/' + _currPage.route)
        if (!wx.getStorageSync("login")) {
            wx.reLaunch({
                url: '/pages/login/login',
            })
        }
    },
    navTo(url) {
        wx.navigateTo({
            url: url,
        })
    },
    tip(msg) {
        wx.showToast({
            title: msg,
            icon: "none"
        })
    },
    pageTitle(name) {
        wx.setNavigationBarTitle({
            title: name,
        })
    },

    common(key) {
        let login = wx.getStorageSync("login")
        return wx.getStorageSync("isOrganizer") ? login.wxappletUserInfo[key] : login.member[key]
    },

    isLogin(cb) {
        let currPage = this.currPage()
        if (wx.getStorageSync("login")) {
            currPage.setData({
                member: wx.getStorageSync("login")
            })
            if (cb) {
                cb()
            }
        } else {
            currPage.setData({
                member: null,
                pageLoading: false
            })
        }
    },

    getSessionKey() {
        return new Promise((res, e) => {
            wx.login({
                success: (login) => {
                    wx.request({
                        url: `${this.ext.host}api/wechatAppSessionApplet.htm`,
                        data: {
                            appId: this.ext.appId,
                            jsCode: login.code,
                            system: '51club'
                        },
                        success: (session) => {
                            res(session.data.result)
                        },
                        fail: (error) => {
                            rej(error)
                        }
                    })
                }
            })
        })
    },

    wechatRegister(detail, code, cb) {
        wx.request({
            url: `${this.ext.host}api/wechatAppSessionApplet.htm`,
            data: {
                appId: this.ext.appId,
                jsCode: code,
                system: '51club'
            },
            success: (data) => {
                console.log(data)
                let parmas = {
                    encryptedData: detail.encryptedData,
                    iv: detail.iv,
                    sessionKey: data.data.result.session_key,
                    superiorMerchantId: this.ext.merchantId,
                }
                this.api.wechatRegister(parmas)
                    .then(res => {
                        wx.hideLoading()
                        if (res.status == '200') {
                            if (res.data.member) {
                                wx.setStorageSync("login", res.data)
                                this.tip("登录成功")
                                cb()
                            } else if (!res.data.isRegister) {
                                wx.setStorageSync('reg', parmas)
                                wx.navigateTo({
                                    url: `/pages/accountRegister/accountRegister`,
                                })
                            }
                        } else {
                            this.tip(res.msg)
                        }
                    })
            }
        })
    },
    getPhoneNumber(e) {
        //手机号注册
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
            let detail = e.detail
            app.getSessionKey().then(session => {
                console.log(session)
                app.api.wechatPhone({
                    encryptedData: detail.encryptedData,
                    iv: detail.iv,
                    sessionKey: session.session_key
                }).then(phone => {
                    if (phone.status == '200') {
                        this.setData({
                            userInfo: true,
                            phone: phone.data,
                            sessionKey: session.session_key
                        })
                    }
                })
            })
        }
    },
    getUserInfos(e) {
        let detail = e.detail
        app.api.wechatRegister({
            encryptedData: detail.encryptedData,
            iv: detail.iv,
            superiorMerchantId: app.ext.merchantId,
            phone: this.data.phone,
            sessionKey: this.data.sessionKey
        }).then(res => {
            if (res.sataus == '200') {
                wx.setStorageSync("login", res.data)
            }
        })
    },
    login(detail, code, cb) {
        if (code == null) {
            wx.login({
                success: (res) => {
                    this.wechatRegister(detail, res.code, cb)
                }
            })
        } else {
            this.wechatRegister(detail, code || wx.getStorageSync("CODE"), cb)
        }
    },

    isPx() {
        //适配iPhone X
        wx.getSystemInfo({
            success: (res) => {
                this.isPX = (res.model.indexOf("iPhone X") != -1) ? true : false
            }
        })
    },

    //检测更新
    updateManager() {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate((res) => {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(() => {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(() => {
            // 新版本下载失败
            wx.showToast({
                title: '新版本下载失败',
                icon: "none"
            })
        })
    },

    converDate(dateStr, flag) {
        dateStr = dateStr.split('-')
        dateStr = dateStr.join('/')
        let martDate = new Date(dateStr),
            num = flag ? '' : ' hh:mm'
        return martDate.getFullYear() == new Date().getFullYear() ? martDate.Format(`MM月dd日${num}`) : martDate.Format(`yyyy年MM月dd日${num}`)
    },

    coverDateList(arr, item) {
        for (let i in arr) {
            arr[i][item] = this.converDate(arr[i][item])
        }
        return arr
    },

    shareApp: {
        title: '活动吧助手-您的活动好帮手',
        path: '/pages/index/index',
        imageUrl: "https://tclub.lx123.com/imgPath//club/activity/1539586281868.jpg"
    }
})