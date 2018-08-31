var dateTimePicker = require('../../libs/dateTimePicker/dateTimePicker.js')
let app = getApp()
Page({
    data: {
        postType: {
            art: "文化艺术",
            exercise: "运动健身",
            meeting: "商务会议",
            offspring: "亲子幼教",
            recreation: "聚会娱乐",
            show: "赛事演出",
            train: "职业培训",
            travel: "旅游户外",
        },
        showPost: false,
        dateTimeArray: null,
        dateTime: null,
        checkOk: true,
        activityticket: [{
            ticketname: '免费票',
            price: 0,
            totalcount: 1000,
            verifytype: 0,
        }],
        applyinfo: [{
                name: "姓名",
                type: 1,
                status: 0
            },
            {
                name: "手机号",
                type: 2,
                status: 0
            }
        ],
        loacaltionTtype: null
    },
    onLoad: function(options) {
        this.postImg()
        let member = wx.getStorageSync("login")
        this.setData({
            member: member
        })
        app.pageTitle('发布活动')
        let nowDate = new Date()
        var obj = dateTimePicker.dateTimePicker(nowDate.getFullYear(), this.data.endYear)
        this.setData({
            startDate: obj.dateTime,
            endDate: obj.dateTime,
            dateTimeArray: obj.dateTimeArray,
            dateTime: obj.dateTime,
            postImg: options.img || null
        })
    },
    checkOk: function(e) {
        console.log(e)
        this.setData({
            checkOk: !this.data.checkOk
        })
    },
    setUpPic: function(type) {
        wx.chooseImage({
            sourceType: type,
            success: (data) => {
                var tempFilePaths = data.tempFilePaths[0]
                console.log(tempFilePaths)
                app.api.uploadPic(tempFilePaths, (img) => {
                    this.setData({
                        postImg: img
                    })
                })
            },
        })
    },
    //选择海报
    chooseImg: function(e) {
        wx.showActionSheet({
            itemList: ["拍照", "手机相册", "海报模板"],
            success: (res) => {
                console.log(res)
                if (res.tapIndex == 0) {
                    this.setUpPic(['camera'])
                } else if (res.tapIndex == 1) {
                    this.setUpPic(["album"])
                } else if (res.tapIndex == 2) {
                    this.setData({
                        showPost: true
                    })
                }
            }
        })
    },
    chooseLocaltion: function(e) {
        console.log(e)
        wx.showActionSheet({
            itemList: ["线上活动", "线下活动"],
            success: res => {
                if (res.tapIndex == 1) {
                    wx.chooseLocation({
                        success: res => {
                            console.log(res)
                            this.setData({
                                localtion: res,
                                loacaltionTtype: 2
                            })
                        }
                    })
                } else {
                    this.setData({
                        loacaltionTtype: 1
                    })
                }
            }
        })
    },
    postImg: function() {
        return app.api.posterTemplate({})
            .then(res => {
                console.log(res)
                let post = res.data
                let postIndex = []
                for (let i in post) {
                    postIndex.push(i)
                }
                let selIndex = postIndex[0]
                this.setData({
                    post: post,
                    postIndex: postIndex,
                    selIndex: selIndex
                })
            })
    },

    creatActivity: function(e) {
        console.log(e)
        let value = e.detail.value
        let member = wx.getStorageSync("login")
        if (value.imgs == "") {
            app.tip("请选择或者上传海报")
        } else if (value.activityname == "") {
            app.tip("请输入活动主题")
        } else if (!this.data.loacaltionTtype) {
            app.tip("请选择活动地点")
        } else if (value.startdate == "" || value.enddate == "") {
            app.tip("请选择活动时间")
        } else if (value.activitydetails == "") {
            app.tip("请活动详情不能为空")
        } else {
            if (!!!member.phone) {
                console.log("member")
                this.setData({
                    nonePhone: true,
                    values: value
                })
            } else {
                console.log("checks")
                this.creatAct(e.detail.value)
            }
        }
    },
    creatAct: function(value) {

        wx.showLoading({
            title: '发布中',
        })
        app.api.publishActivity(value)
            .then(res => {
                wx.hideLoading()
                if (res.data) {
                    wx.removeStorageSync("activitydetails")
                    wx.removeStorageSync("applyinfo")
                    wx.removeStorageSync("activityticket")
                    app.tip(res.msg)
                    wx.navigateTo({
                        url: `/pages/activityShare/activityShare?public=${res.data}`,
                    })
                } else {
                    app.tip(res.msg)
                }
            })

    },
    postChange(e) {
        console.log(e)
        this.setData({
            selIndex: e.detail.currentItemId
        })
    },
    choosePost: function(e) {
        this.setData({
            selIndex: e.target.id
        })
    },
    getUrl: function(e) {
        this.setData({
            postImg: e.currentTarget.dataset.url,
            showPost: false
        })
    },
    changeSatartDate(e) {
        this.setData({
            startDate: e.detail.value,
            endDate: e.detail.value
        });
    },
    changeEndDate(e) {
        this.setData({
            endDate: e.detail.value
        });
    },
    changeDateColumn(e) {
        var arr = this.data.dateTime,
            dateArr = this.data.dateTimeArray
        arr[e.detail.column] = e.detail.value
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])
        console.log(arr)
        this.setData({
            dateTimeArray: dateArr,
            dateTime: arr
        });

    },
    toFee() {
        wx.navigateTo({
            url: '/pages/actFee/actFee',
        })
    },
    toInfo() {
        wx.navigateTo({
            url: '/pages/actInfo/actInfo',
        })
    },
    toDetail() {
        wx.navigateTo({
            url: '/pages/actDetail/actDetail',
        })
    },
    onReady: function() {

    },
    onShow: function() {
        //fee setting
        let applyinfo
        if (wx.getStorageSync("applyinfo")) {
            applyinfo = wx.getStorageSync("applyinfo")
            for (let i in applyinfo) {
                let item = applyinfo[i]
                for (let s in item) {
                    if (s == 'selected' || s == 'selfId') {
                        delete item[s]
                    }
                }
            }
        }
        let activitydetails
        let activitydetailsStr = ''
        if (wx.getStorageSync("activitydetails")) {
            activitydetails = wx.getStorageSync("activitydetails")
            let str = ''
            for (let i in activitydetails) {
                let items = activitydetails[i]
                if (items.img) {
                    activitydetailsStr += `<p class='x-img'><img src='${items.img}' /></p>`
                }
                if (items.txt) {
                    activitydetailsStr += `<p class='x-txt'>${items.txt}</p>`
                }
            }
            console.log(activitydetailsStr)
        }
        let activityticketStr = wx.getStorageSync("activityticket") ? JSON.stringify(wx.getStorageSync("activityticket")) : JSON.stringify(this.data.activityticket)
        // console.log(JSON.stringify(applyinfo))
        let a = JSON.stringify(wx.getStorageSync("activityticket"))
        let strs = JSON.stringify(this.data.activityticket)
        this.setData({
            activitydetails: wx.getStorageSync("activitydetails") || null,
            activityticket: wx.getStorageSync("activityticket") || this.data.activityticket,
            applyinfo: applyinfo || this.data.applyinfo,
            activitydetailsStr: activitydetailsStr,
            activityticketStr: activityticketStr,
            applyinfoStr: JSON.stringify(applyinfo) || JSON.stringify(this.data.applyinfo)
        })
    },
    phoneBlur(e) {
        if (!this.checkPhone(e.detail.value)) {
            app.tip("请输入正确的手机号")
        }
    },
    checkPhone(num) {
        let phone = /^[1][3,4,5,7,8][0-9]{9}$/
        console.log(phone.test(num))
        return phone.test(num)
    },
    phoneValue(e) {
        let isPass = !this.checkPhone(e.detail.value) ? false : true
        this.setData({
            isPass: isPass,
            phoneValue: e.detail.value
        })
    },
    getCodes(e) {
        wx.showLoading()
        app.api.sendVerifyCode({
                merchantId: app.common("merchantid"),
                superMerchantId: app.common("superiormerchantid"),
                mobilePhone: this.data.phoneValue
            })
            .then(res => {
                console.log(res)
                wx.hideLoading()
                if (res.status = '200') {
                    app.tip(`验证短信${res.data.resultDesc}`)
                    wx.setStorageSync("login", res.data)
                    for (let i = 0; i <= 120; i++) {
                        setTimeout(() => {
                            this.setData({
                                isPass: false,
                                phoneDone: true,
                                endtime: 120 - i
                            });
                            if (this.data.endtime == 0) {
                                this.setData({
                                    isPass: true,
                                    phoneDone: false,
                                    endtime: 120
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
    },
    bindPhone(value) {
        wx.showLoading({
            title: '绑定手机中',
        })
        app.api.bindingMobilePhone({
                merchantId: app.common("merchantid"),
                applyProgressKey: this.data.applyProgressKey,
                verificationCode: this.data.phoneCode,
                mobilePhone: this.data.phoneValue
            })
            .then(res => {
                console.log(res)
                wx.hideLoading()
                let status = res.status
                if (status == '1004' || status == '1005') {
                    app.tip(res.msg)
                } else if (status == '200') {
                    this.creatAct(this.data.values)
                    this.setData({
                        nonePhone: false
                    })
                }
            })
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