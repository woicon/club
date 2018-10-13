var dateTimePicker = require('../../libs/dateTimePicker/dateTimePicker.js')
var WxParse = require('../../wxParse/wxParse.js')
var base = require('../../utils/util.js')
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
        endTimeArray: null,
        startDate: null,
        endDate: null,
        checkOk: true,
        activityTicket: [{
            ticketName: '免费票',
            price: 0,
            totalCount: 10000,
            verifyType: 0,
        }],
        applyInfo: [{
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
        loacaltionTtype: null,
    },
    onLoad(options) {
        app.isLogin()
        app.pageTitle(options.edit ? '编辑活动' : '发布活动')
        this.setData({
            postImg: options.img || null,
            label: options.label || null
        })
        if (options.edit) {
            this.editInit()
        } else(
            this.initDate()
        )
    },
    initDate(date) {
        date = date || {}
        //时间控件初始化
        let nowDate = new Date()
        let obj = dateTimePicker.dateTimePicker(nowDate.getFullYear(), nowDate.getFullYear() + 3, date.startDate || null)
        let endDate = nowDate.setDate(nowDate.getDate() + 7)
        let endObj = dateTimePicker.dateTimePicker(nowDate.getFullYear(), nowDate.getFullYear() + 3, date.endDate || base.formatTime(new Date(endDate)))
        console.log(endObj)
        this.setData({
            startDate: obj.dateTime,
            endDate: endObj.dateTime,
            endTimeArray: endObj.dateTimeArray,
            dateTimeArray: obj.dateTimeArray
        })
        this.setTimeInfo()
    },

    editInit() {
        //编辑活动初始化
        let detail = wx.getStorageSync("editActivity")
        this.initDate({
            startDate: detail.startDate,
            endDate: detail.endDate
        })
        let activityDetails = detail.activityDetails
        console.log(activityDetails)
        WxParse.wxParse('article', 'html', activityDetails, this)
        let nodes = this.data.article.nodes
        let arrs = []
        let txt = []
        let imgs = this.data.article.imageUrls
        for (let i in imgs) {
            arrs.push({
                img: imgs[i]
            })
        }
        console.log(arrs)
        if (arrs.length > 1) {
            for (let i in nodes) {
                let node = nodes[i]
                if (node.classStr == 'x-txt') {
                    txt.push(node.nodes[0].text)
                }
            }
            if (txt.length > arrs.length) {
                for (let i in txt) {
                    if (arrs[i]) {
                        arrs[i].txt = txt[i]
                    } else {
                        arrs.push({
                            txt: txt[i]
                        })
                    }
                }
            } else {
                for (let i in arrs) {
                    if (txt[i]) {
                        arrs[i].txt = txt[i]
                    }
                }
            }
        } else {
            for (let i in nodes) {
                let node = nodes[i]
                console.log(node)
                if (node.classStr == 'x-txt') {
                    arrs.push({
                        txt: node.nodes[0].text
                    })
                }
            }
        }
        console.log(arrs)
        wx.setStorageSync("activityDetails", arrs)
        var loacaltionTtype = (detail.activityAddress) ? 2 : 1
        wx.setStorageSync("applyInfo", detail.activityEnrollInfoResponseList)
        this.setData({
            detail: detail,
            isEdit: true,
            activityDetails: arrs,
            loacaltionTtype: loacaltionTtype,
            postImg: detail.activityImg,
            label: detail.label,
            timeId: detail.activityTimeList[0].id,
            activityTicket: detail.activityTicketList
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
    chooseImg(e) {
        wx.showActionSheet({
            itemList: ["拍照", "手机相册", "海报模板"],
            success: (res) => {
                console.log(res)
                if (res.tapIndex == 0) {
                    this.setUpPic(['camera'])
                } else if (res.tapIndex == 1) {
                    this.setUpPic(["album"])
                } else if (res.tapIndex == 2) {
                    wx.navigateTo({
                        url: '/pages/postTemplate/postTemplate',
                    })
                    // this.setData({
                    //     showPost: true
                    // })
                }
            }
        })
    },

    mapChoose() {
        wx.chooseLocation({
            success: res => {
                console.log(res)
                this.setData({
                    localtion: res,
                    loacaltionTtype: 2
                })
            },
            fail: (error) => {
                console.log(error)
                if (error.errMsg == 'chooseLocation:fail auth deny') {
                    this.setData({
                        toAuth: true
                    })
                }
            }
        })
    },

    chooseLocaltion(e) {
        console.log(e)
        wx.showActionSheet({
            itemList: ["设置地点（线下活动）", "线上活动"],
            success: res => {
                if (res.tapIndex == 0) {
                    this.mapChoose()
                } else {
                    this.setData({
                        loacaltionTtype: 1
                    })
                }
            },

        })
    },

    getLogin(e) {
        //console.log(e)
        this.setData({
            btnLoading: true
        })
        app.login(e.detail, null, () => {
            console.log("sdd")
            let member = wx.getStorageSync("login")
            let submitData = this.data.submitData
            submitData.userId = member.id
            console.log("登录成功", submitData)
            this.setData({
                member: wx.getStorageSync("login"),
                submitData: submitData
            })
            this.checkActForm(this.data.submitData)
        })
    },

    creatActivity: function(e) {
        console.log(e)
        let value = e.detail.value
        this.setData({
            submitData: e.detail.value,
        })
        this.checkActForm(this.data.submitData)
    },

    checkActForm(value) {
        if (this.data.member) {
            //let member = wx.getStorageSync("login")
            if (value.imgs == "") {
                app.tip("请选择或者上传海报")
            } else if (value.activityName == "") {
                app.tip("请输入活动主题")
            } else if (!this.data.loacaltionTtype) {
                app.tip("请选择活动地点")
            } else if (value.startDate == "" || value.endDate == "") {
                app.tip("请选择活动时间")
            } else if (value.activityDetails == "") {
                app.tip("活动详情不能为空")
            } else {
                // if (!!!member.phone) {
                //   console.log("member")
                //   this.setData({
                //     nonePhone: true,
                //     values: value
                //   })
                // } else {
                //   console.log("checks")
                if (this.data.checkOk) {
                    this.setData({
                        btnLoading: true
                    })
                    this.creatAct(value)
                } else {
                    app.tip("必须同意《活动汇技术支持服务协议》")
                }
                // }
            }
        }
    },
    creatAct(value) {
        let msg = this.data.isEdit ? "修改中" : "发布中"
        wx.showLoading({
            title: msg,
        })
        app.api.publishActivity(value)
            .then(res => {
                wx.hideLoading()
                console.log(res)
                if (res.data) {
                    wx.removeStorageSync("activityDetails")
                    wx.removeStorageSync("applyInfo")
                    wx.removeStorageSync("activityTicket")
                    app.tip(res.msg)
                    if (this.data.isEdit) {
                        app.tip("修改成功")
                        wx.navigateBack()
                    } else {
                        wx.redirectTo({
                            url: `/pages/activityShare/activityShare?public=${res.data}`,
                        })
                    }
                } else {
                    app.tip(res.msg)
                    this.setData({
                        btnLoading: false
                    })
                }
            }).catch(error => {
                console.log(error)
                this.setData({
                    btnLoading: false
                })
            })
    },
    changeSatartDate(e) {
        this.setData({
            startDate: e.detail.value,
            endDate: e.detail.value
        })
        this.setTimeInfo()
    },
    setTimeInfo() {
        let dateTimeArray = this.data.dateTimeArray,
            startDate = this.data.startDate,
            endDate = this.data.endDate
        const timeInfo = [{
            startDate: `${dateTimeArray[0][startDate[0]]}-${dateTimeArray[1][startDate[1]]}-${dateTimeArray[2][startDate[2]]}`,
            startTime: `${dateTimeArray[3][endDate[3]]}:${dateTimeArray[4][endDate[4]]}`,
            endDate: `${dateTimeArray[0][endDate[0]]}-${dateTimeArray[1][endDate[1]]}-${dateTimeArray[2][endDate[2]]}`,
            endTime: `${dateTimeArray[3][endDate[3]]}:${dateTimeArray[4][endDate[4]]}`,
        }]
        // <input name="startDate" class='hidden' value = '{{dateTimeArray[0][startDate[0]]}}-{{dateTimeArray[1][startDate[1]]}}-{{dateTimeArray[2][startDate[2]]}}' > </input>
        // < input name = "startTime" class='hidden' value = '{{dateTimeArray[3][endDate[3]]}}:{{dateTimeArray[4][endDate[4]]}}' > </input>
        // < input name = "endDate" class='hidden' value = '{{dateTimeArray[0][endDate[0]]}}-{{dateTimeArray[1][endDate[1]]}}-{{dateTimeArray[2][endDate[2]]}}' > </input>
        // < input name = "endTime" class='hidden' value = '{{dateTimeArray[3][endDate[3]]}}:{{dateTimeArray[4][endDate[4]]}}' > </input>
        this.setData({
            timeInfo:JSON.stringify(timeInfo)
        })
    },
    changeEndDate: function(e) {
        let dateTimeArray = this.data.dateTimeArray
        let startDate = this.data.startDate
        let endTimeArray = this.data.endTimeArray
        let endDate = this.data.endDate
        let startDateStr = `${dateTimeArray[0][startDate[0]]}/${dateTimeArray[1][startDate[1]]}/${dateTimeArray[2][startDate[2]]} ${dateTimeArray[3][startDate[3]]}:${dateTimeArray[4][startDate[4]]}`
        let endDateStr = `${endTimeArray[0][endDate[0]]}/${endTimeArray[1][endDate[1]]}/${endTimeArray[2][endDate[2]]} ${endTimeArray[3][endDate[3]]}:${endTimeArray[4][endDate[4]]}`
        console.log(startDateStr, ':::', endDateStr)
        // [{ 'startDate': '2018-08-11', 'startTime': '08:00', 'endDate': '2018-11-11', 'endTime': '08:00', 'applicableWeek': '0,1,2' }]
        if (this.isErrorTime(startDateStr, endDateStr)) {
            app.tip("活动开始时间不能大于结束时间")
        } else {
            this.setData({
                endDate: e.detail.value
            })
            this.setTimeInfo()
        }
    },
    isErrorTime(startDate, endDate) {
        let start = new Date(startDate).getTime()
        let end = new Date(endDate).getTime()
        return start > end
    },
    changeDateColumn: function(e) {
        console.log("ILST::==>", e)
        let arr = this.data[e.currentTarget.id]
        //  let targetTime = e.currentTarget.dataset.id
        let dateArr = this.data[e.currentTarget.dataset.id]
        arr[e.detail.column] = e.detail.value
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])
        this.setData({
            [e.currentTarget.dataset.id]: dateArr,
            // [e.currentTarget.id]: arr
        })
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
        let applyInfo
        if (wx.getStorageSync("applyInfo")) {
            applyInfo = wx.getStorageSync("applyInfo")
            for (let i in applyInfo) {
                let item = applyInfo[i]
                for (let s in item) {
                    if (s == 'selected' || s == 'selfId') {
                        delete item[s]
                    }
                }
            }
        }
        let activityDetails
        let activityDetailsStr = ''
        if (wx.getStorageSync("activityDetails")) {
            activityDetails = wx.getStorageSync("activityDetails")
            let str = ''
            for (let i in activityDetails) {
                let items = activityDetails[i]
                if (items.img) {
                    activityDetailsStr += `<p class='x-img'><img src='${items.img}' /></p>`
                }
                if (items.txt) {
                    activityDetailsStr += `<p class='x-txt'>${items.txt}</p>`
                }
            }
            console.log(activityDetailsStr)
        }
        let activityTicketStr = wx.getStorageSync("activityTicket") ? JSON.stringify(wx.getStorageSync("activityTicket")) : JSON.stringify(this.data.activityTicket)
        // console.log(JSON.stringify(applyInfo))
        let a = JSON.stringify(wx.getStorageSync("activityTicket"))
        let strs = JSON.stringify(this.data.activityTicket)

        this.setData({
            activityDetails: wx.getStorageSync("activityDetails") || null,
            activityDetailsStr: activityDetailsStr,

            activityTicket: wx.getStorageSync("activityTicket") || this.data.activityTicket,
            activityTicketStr: activityTicketStr,

            applyInfo: applyInfo || this.data.applyInfo,
            applyInfoStr: JSON.stringify(applyInfo) || JSON.stringify(this.data.applyInfo),
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
                merchantId: app.common("merchantId"),
                superMerchantId: app.common("superiorMerchantId"),
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
    },
    bindPhone(value) {
        wx.showLoading({
            title: '绑定手机中',
        })
        app.api.bindingMobilePhone({
                merchantId: app.common("merchantId"),
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
    handleSetting(e) {
        console.log(e)
        if (!e.detail.authSetting['scope.userLocation']) {
            this.setData({
                toAuth: true
            })
        } else {
            this.mapChoose()
            this.setData({
                toAuth: false
            })
        }
    }
})