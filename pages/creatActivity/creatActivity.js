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
        date: '2018/08/01 10:30',
        time: '12:00',
        dateTimeArray: null,
        dateTime: null,
        startYear: 2018,
        checkOk: true,
    },
    onLoad: function(options) {
        this.postImg()
        let member = wx.getStorageSync("login")
        this.setData({
            member: member
        })
        wx.setNavigationBarTitle({
            title: '发布活动',
        })
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear)
        this.setData({
            startDate: obj.dateTime,
            endDate: obj.dateTime,
            dateTimeArray: obj.dateTimeArray,
            postImg:options.img || null,
            activitydetails: wx.getStorageSync("activitydetails") || null
        });
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
                                loacaltionTtype: 1
                            })
                        }
                    })
                } else {
                    this.setData({
                        loacaltionTtype: 0
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
        // { "id": 80, "nickname": "35430.36867486444", "avatarurl": "http://www.51club.com/admin/images/bg/4.jpg", "gender": 1, "city": "北京", "province": "北京", "country": "中国", "language": "zh", "merchantid": 10114189, "superiormerchantid": 10113413, "openid": "62847", "unionid": "31835", "userintro": null }
        let value = e.detail.value
        if (value.imgs == '') {
            app.tip("请选择或者上传海报")
        } else if (value.activityname == '') {
            app.tip("请输入活动主题")
        } else if (!this.data.loacaltionTtype || this.data.loacaltionTtype.loacaltionTtype == 0) {
            app.tip("请选择活动地点")
        } else if (value.imgs == '') {
            app.tip("请选择或者上传海报")
        } else if (value.startdate = '' || value.enddate == "") {
            app.tip("请选择活动时间")
        }
        let parmas = {
            activityaddress: value.activityaddress,
            activityname: value.activityname,
            enddate: "2018-09-22",
            endtime: "18:00",
            lat: "39.85995",
            lon: "116.28733",
            startdate: "2018-09-22",
            starttime: "09:00",
            userid: 80,
            imgs: "http://tclub.lx123.com/admin/images/applet/3.jpg",
            activityticket: "[{'ticketname': '免费票','price': '0','totalcount': '10','verifytype':'0' },{'ticketname':'收费票','price': '1','totalcount': '10','verifytype':'1'}]",
            applyinfo: "[{'name': '姓名', 'type': '1', 'status': '1' },{ 'name': '手机号', 'type': '2', 'status': '1' }]",
            activitydetails: "232"
        }
        // let parmas = e.detail.value
        // api.publishActivity(parmas, "POST")
        //     .then(res => {
        //         console.log(res)
        //     })
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
        console.log(e);
        this.setData({
            endDate: e.detail.value
        });
    },
    changeDateColumn(e) {
        console.log(e)
        let arr
        let name = e.target.id
        if (name == 'startDate') {
            arr = this.data.startDate
        } else if (name == 'endDate') {
            arr = this.data.EndDate
        }
        let dateArr = this.data.dateTimeArray
        arr[e.detail.column] = e.detail.value
        console.log(dateArr)
        console.log(arr)
        this.setData({
            dateTimeArray: dateArr
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
    toDetail(){
        wx.navigateTo({
            url: '/pages/actDetail/actDetail',
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