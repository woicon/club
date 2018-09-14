let app = getApp()
Page({
    data: {
        // status 状态0 必填  1 选填  2 删除 
        applyInfo: [{
                name: "姓名",
                type: 1,
                status: 0,
                fieldType: 0,
            },
            {
                name: "手机号",
                type: 2,
                status: 0,
                fieldType: 0,
            }
        ],
        infoType: [{
                name: "身份证号",
                type: 3,
                status: 0,
                fieldType: 0,
            },
            {
                name: "微信",
                type: 0,
                status: 0,
                fieldType: 0,
            },
            {
                name: "公司",
                type: 0,
                status: 1,
                fieldType: 0,
            },
            {
                name: "职位",
                type: 0,
                status: 1,
                fieldType: 0,
            },
            {
                name: "行业",
                type: 0,
                status: 1,
                fieldType: 0,
            },
            {
                name: "年龄",
                type: 0,
                status: 1,
                fieldType: 0,
            },
            {
                name: "邮箱",
                type: 0,
                status: 1,
                fieldType: 0,
            },
            {
                name: "护照",
                type: 0,
                status: 1,
                fieldType: 0,
            },
        ],
        addTtypes: false
    },
    noneEdit(){
        app.tip("默认项不能编辑")
    },
    toggleItem() {
        this.setData({
            addTtypes: !this.data.addTtypes
        })
    },

    selectType: function(e) {
        console.log(e)
        let applyInfo = this.data.applyInfo
        let infoType = this.data.infoType
        if (!infoType[e.target.dataset.index].selected) {
            let items = infoType[e.target.dataset.index]
            items.selected = true
            items.selfId = e.target.dataset.index
            applyInfo.push(items)
            this.setData({
                applyInfo: applyInfo,
                addTtypes: false,
                infoType: infoType
            })
        } else {
            app.tip("该项目已添加")
        }
    },
    deleteType(e) {
        console.log(e)
        let applyInfo = this.data.applyInfo
        let infoType = this.data.infoType
        let index = e.target.dataset.index
        //infoType.push(e.target.dataset.type)
        applyInfo.splice(index, 1)
        if (e.target.dataset.self || e.target.dataset.self == 0) {
            infoType[e.target.dataset.self].selected = false
        }
        this.setData({
            applyInfo: applyInfo,
            infoType: infoType
        })
    },
    toggleSwitch() {
        console.log(e)
        let applyInfo = this.data.applyInfo
        let infoType = this.data.infoType
        infoType.push(e.target.dataset.type)
        applyInfo.splice(e.target.dataset.index, 1)
        this.setData({
            applyInfo: applyInfo,
            infoType: infoType
        })
    },
    changeSwitch(e) {
        console.log(e)
        let applyInfo = this.data.applyInfo
        applyInfo[e.target.dataset.index].status = e.detail.value ? 0 : 1
        this.setData({
            applyInfo: applyInfo
        })
    },
    toType(e) {
        console.log(e)
        this.setData({
            addTtypes: false
        })
        wx.removeStorageSync("customField")
        wx.navigateTo({
            url: `/pages/addInfo/addInfo?id=${e.target.id}&name=${e.target.dataset.name}`,
        })
    },
    editCol(e) {
        wx.setStorageSync("editCol",this.data.applyInfo[e.currentTarget.dataset.index])
        wx.navigateTo({
            url: `/pages/addInfo/addInfo?id=${e.currentTarget.dataset.fieldtype}&edit=true&index=${e.currentTarget.dataset.index}`,
        })
    },
    onLoad: function(e) {
        app.pageTitle("报名设置")
    },
    saveForm() {
        wx.setStorageSync("applyInfo", this.data.applyInfo)
        wx.navigateBack()
    },
  
    onShow() {
        if (wx.getStorageSync("applyInfo")) {
            let applyInfo = wx.getStorageSync("applyInfo")
            let infoType = this.data.infoType
            for (let i in applyInfo) {
                let item = applyInfo[i]

                for (let s in infoType) {
                    let items = infoType[s]
                    if (item.name == items.name) {
                        items.selected = true
                        items.selfId = s
                        item.selected = true
                        item.selfId = s
                    }
                }
            }
            this.setData({
                applyInfo: applyInfo,
                infoType: infoType
            })
        }
    }
})