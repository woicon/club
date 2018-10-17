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
        //编辑活动时间初始化处理
        let activityDate = detail.activityTimeList[0]
        this.initDate({
            startDate: `${activityDate.startDate} ${activityDate.startTime}`,
            endDate: `${activityDate.endDate} ${activityDate.endTime }`
        })
        let activityDetails = detail.activityDetails
        //编辑活动详情初始化处理
        WxParse.wxParse('article', 'html', activityDetails, this)
        let nodes = this.data.article.nodes,arrs = [],txt = [],imgs = this.data.article.imageUrls
        for (let i in imgs) {
            arrs.push({
                img: imgs[i]
            })
        }
        //详情
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

    checkOk(e) {
        this.setData({
            checkOk: !this.data.checkOk
        })
    },

    setUpPic(type) {
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
        //未注册发布需要先注册
        this.setData({
            btnLoading: true
        })
        app.login(e.detail, null, () => {
            let member = wx.getStorageSync("login")
            let submitData = this.data.submitData
            submitData.userId = member.id
            this.setData({
                member: wx.getStorageSync("login"),
                submitData: submitData
            })
            this.checkActForm(this.data.submitData)
        })
    },

    creatActivity(e) {
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
            startTime: `${dateTimeArray[3][startDate[3]]}:${dateTimeArray[4][startDate[4]]}`,
            endDate: `${dateTimeArray[0][endDate[0]]}-${dateTimeArray[1][endDate[1]]}-${dateTimeArray[2][endDate[2]]}`,
            endTime: `${dateTimeArray[3][endDate[3]]}:${dateTimeArray[4][endDate[4]]}`,
        }]
        if (this.data.isEdit) {
            timeInfo[0].id = this.data.detail.activityTimeList[0].id
        }
        this.setData({
            timeInfo: JSON.stringify(timeInfo)
        })
    },
    dateStr(d,r){
        return `${d[0][dateArr[0]]}/${d[1][r[1]]}/${d[2][r[2]]} ${d[3][r[3]]}:${d[4][r[4]]}`
    },
    actTitle(e){
        if(e.detail.value.length==50){
            app.tip("标题最多只能输入50个字符")
        }
    },
    changeEndDate: function(e) {
        let dateTimeArray = this.data.dateTimeArray
        let startDate = this.data.startDate
        let endTimeArray = this.data.endTimeArray
        let endDate = this.data.endDate
        let startDateStr = this.dateStr(dateTimeArray, startDate)
        let endDateStr = this.dateStr(dateTimeArray, startDate)
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
    onShow() {
        app.isLogin()
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