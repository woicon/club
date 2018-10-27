// pages/applyPerson/applyPerson.js
let app = getApp(),
    form = ""
Page({
    data: {
        curentIndex: 0,
        responseList: [],
        form: {},
        msg: '',
        radioTxt: '',
        checkTxt: '',
        radioArr: [],
        checkArr: [],
        selNum: 0,
        isActive: 0,
        name: '',
        ctime: 'undefined',
        txtStatus: 0, //必填项*
        personNum: 1 //活动报名人数
    },
    onLoad: function(options) {
        app.pageTitle("填写报名人信息");
        let orderParams = wx.getStorageSync("orderParams"),
            applyDetail = wx.getStorageSync("applyDetail"),
            _this = this,
            responseList = applyDetail.activityEnrollInfoResponseList
        responseList.forEach(function(item, x) {
            let arr = new Array()
            if (item.fieldOption != null) {
                arr.push(item.fieldOption.split("$"))
                item.fieldOption = arr
            }
            for (let i = 0; i < orderParams.num; i++) {
                if (item.fieldType == 2) {
                    _this.data.radioArr.push(arr[0][0])
                } else if (item.fieldType == 3) {
                    _this.data.checkArr.push(arr[0][0])
                }
            }
        })
        this.data.responseList = responseList
        form = {
            activityId: applyDetail.id,
            orderPrice: orderParams.price,
            payPrice: orderParams.price,
            //orderType : 0,
            ticketCount: orderParams.num,
            memberId: app.common("memberId"), //会员id
            merchantId: applyDetail.merchantId,
            channelId: applyDetail.activityChannel.id, //渠道id
            inventoryId: orderParams.inid, //库存id
            ticketId: orderParams.id, //票Id
            ticketName: orderParams.ticketName //票名称
        }
        this.setData({
            responseList: responseList,
            form: form,
            personNum: orderParams.num
        })
    },
    radioChange(e) {
        let index = e.target.dataset.index
        this.data.radioArr[index] = e.detail.value
        if (this.data.radioArr.length > this.data.personNum) {
            this.data.radioArr.push(this.data.radioArr[index])
        }
    },
    checkChange(e) {
        let index = e.target.dataset.index
        if (e.detail.value.length > 0) {
            this.data.checkArr[index] = e.detail.value.join("$")
        }
        if (this.data.checkArr.length > this.data.personNum) {
            this.data.checkArr.push(this.data.checkArr[index])
        }
    },
    bindPickerChange(e) {
        this.setData({
            selNum: parseInt(e.detail.value)
        })
    },
    formSubmit(e) {
        let arrTxt = [],
            _this = this,
            arrXml = [],
            statusArr = []
        form = this.data.form
        arrTxt.push(e.detail.value)
        let flag = false,
            i = 0
        for (let i = 0; i < this.data.personNum; i++) {
            let arr = []
            if (this.data.responseList.length > 0) {
                this.data.responseList.forEach(function(item, x) {
                    if (item.fieldType == 0 || item.fieldType == 1) {
                        item.fieldOption = `${arrTxt[0]["name" + i + x]}`
                    } else if (item.fieldType == 2) {
                        item.fieldOption = _this.data.radioArr[i]
                    } else if (item.fieldType == 3) {
                        item.fieldOption = _this.data.checkArr[i]
                    } else if (item.fieldType == 4) {
                        item.fieldOption = parseInt(_this.data.selNum) + 1
                    }
                    if (item.status == 0) {
                        if (item.fieldOption == "") {
                            app.tip(`请输入所有*必填项`)
                            flag = true
                        }
                        if (item.fieldOption != "" && item.name == "手机号") {
                            if (app.check.phone(item.fieldOption) == false) {
                                app.tip(`请输入正确11位手机号`)
                                flag = true
                            }
                        }
                    }
                    arr.push(`<field><name>${item.name}</name><value>${item.fieldOption}</value><type>${item.type}</type><sequence>${item.infoSequence}</sequence><fieldtype>${item.fieldType}</fieldtype></field>`)
                })
            } else {
                if (arrTxt[0]["name" + i + 0] == "" || arrTxt[0]["name" + i + 1] == "") {
                    app.tip(`请输入所有*必填项`)
                    flag = true
                }
                if (arrTxt[0]["name" + i + 1] != "") {
                    if (app.check.phone(arrTxt[0]["name" + i + 1]) == false) {
                        app.tip(`请输入正确11位手机号`)
                        flag = true
                    }
                }
                arr.push(`<field><name>姓名</name><value>${arrTxt[0]["name" + i + 0]}</value><type>0</type><sequence>0</sequence><fieldtype>0</fieldtype></field><field><name>手机号</name><value>${arrTxt[0]["name" + i + 1]}</value><type>0</type><sequence>0</sequence><fieldtype>0</fieldtype></field>`)
            }
            arrXml.push(`{"enrollXml":'<enrollInfo>${arr.join("")}</enrollInfo>'}`)
        }
        form.enrollInfos = `[${arrXml.join(",")}]`
        if (flag == false) {
            this.setData({
                btnLoading: true
            })
            form.contactsName = arrTxt[0]["name00"]
            form.contactsPhone = arrTxt[0]["name01"]
            this.setData({
                form: form
            })
            wx.setStorageSync("form", this.data.form)
            app.api.createAppletOrder(this.data.form).then((res) => {
                //if(this.data.form.price==0){}
                this.setData({
                    btnLoading: false
                })
                console.log(res)
                if (res.status == "200") {
                    wx.reLaunch({
                        url: '/pages/applySuccess/applySuccess?id=' + res.data,
                    })
                } else {
                    app.tip(res.msg)
                }
            })
        }
    }
})