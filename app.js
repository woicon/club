var api = require('newApi/newApi.js')
var app = getApp()
var types = require('utils/types.js')
var base = require('utils/util.js')
App({
    onLaunch: function(options) {
        let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
        this.ext = extConfig
        this.api = api(extConfig.host)
        this.check = base.check
        this.types = types
        wx.setStorageSync("ext", extConfig)
        console.log("ApiList==>16:33", this.api)
        console.log("EXT.JSON==>Version::" + this.version, extConfig)
        this.isPx()
        console.log(this)
        wx.login({
            success: (res) => {
                wx.setStorageSync("CODE", res.code)
            }
        })
    },
    version: "1.0.1",
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
        console.log(wx.getStorageSync("isOrganizer"))
        return wx.getStorageSync("isOrganizer") ? login.wxappletUserInfo[key] : login.member[key]
    },

    isLogin(cb) {
        let currPage = this.currPage()
        if (wx.getStorageSync("login")) {
            console.log("IsLogin::===>", wx.getStorageSync("login"))
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
    wxLogin: function() {
        wx.login({
            success: (res) => {
                console.log("wxLogin::==>", res)
                wx.setStorageSync("CODE", res.code)
            }
        })
    },

    wechatRegister(detail, code, cb) {
        wx.request({
            url: `${this.ext.host}api/wechatAppSession.htm`,
            data: {
                appId: this.ext.appId,
                jsCode: code
            },
            success: (data) => {
                console.log(data)
                let parmas = {
                    encryptedData: detail.encryptedData,
                    iv: detail.iv,
                    sessionKey: data.data.result.session_key,
                    superiorMerchantId: this.ext.merchantId,
                }
                wx.setStorageSync('reg', parmas)
                // wx.navigateTo({
                //     url: `/pages/accountRegister/accountRegister`,
                // })
                this.api.wechatRegister(parmas)
                    .then(res => {
                        wx.hideLoading()
                        console.log(res)
                        if (res.status == '200') {
                            wx.setStorageSync("login", res.data)
                            this.tip("登录成功")
                            cb()
                        } else {
                            wx.setStorageSync('reg', parmas)
                            wx.navigateTo({
                                url: `/pages/accountRegister/accountRegister`,
                            })
                        }
                        // if (res.data) {
                        //     wx.setStorageSync("login", res.data)
                        //     this.tip("登录成功")
                        //     cb()
                        // } else {
                        //     let currPage = this.currPage()
                        //     this.tip(res.msg)
                        //     currPage.setData({
                        //         btnLoading: false
                        //     })
                        // }
                    })
            }
        })
    },

    login(detail, code, cb) {
        var ext = this.ext
        console.log(ext)
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
            this.tip("更新失败")
        })
    },
    converDate(dateStr,flag) {
        dateStr = dateStr.split('-')
        dateStr = dateStr.join('/')
        let martDate = new Date(dateStr),
            num = flag ? '':' hh:mm'
   return martDate.getFullYear() == new Date().getFullYear() ? martDate.Format(`MM月dd日${num}`) : martDate.Format(`yyyy年MM月dd日${num}`)
    }
})