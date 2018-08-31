let app = getApp()
Page({
    data: {
        // status 状态0 必填  1 选填  2 删除 
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
        infoType: [{
                name: "身份证号",
                type: 3,
                status: 0
            },
            {
                name: "微信",
                type: 0,
                status: 0
            },
            {
                name: "公司",
                type: 0,
                status: 1
            },
            {
                name: "职位",
                type: 0,
                status: 1
            },
            {
                name: "行业",
                type: 0,
                status: 1
            },
            {
                name: "年龄",
                type: 0,
                status: 1
            },
            {
                name: "邮箱",
                type: 0,
                status: 1
            },
            {
                name: "护照",
                type: 0,
                status: 1
            },
        ],
        addTtypes: false
    },

    toggleItem() {
        this.setData({
            addTtypes: !this.data.addTtypes
        })
    },

    selectType: function(e) {
        console.log(e)
        let applyinfo = this.data.applyinfo
        let infoType = this.data.infoType
        if (!infoType[e.target.dataset.index].selected){
            let items = infoType[e.target.dataset.index]
            items.selected = true
            items.selfId = e.target.dataset.index
            applyinfo.push(items)
            this.setData({
                applyinfo: applyinfo,
                addTtypes: false,
                infoType: infoType
            })
        }else{
            app.tip("该项目已添加")
        }
    },
    deleteType(e) {
        console.log(e)
        let applyinfo = this.data.applyinfo
        let infoType = this.data.infoType
        let index = e.target.dataset.index
        //infoType.push(e.target.dataset.type)
        applyinfo.splice(index, 1)
        if (e.target.dataset.self || e.target.dataset.self == 0){
            infoType[e.target.dataset.self].selected = false
        }
        this.setData({
            applyinfo: applyinfo,
            infoType: infoType
        })
    },
    toggleSwitch() {
        console.log(e)
        let applyinfo = this.data.applyinfo
        let infoType = this.data.infoType
        infoType.push(e.target.dataset.type)
        applyinfo.splice(e.target.dataset.index, 1)
        this.setData({
            applyinfo: applyinfo,
            infoType: infoType
        })
    },
    changeSwitch(e) {
        console.log(e)
        let applyinfo = this.data.applyinfo
        applyinfo[e.target.dataset.index].status = e.detail.value ? 0 : 1
        this.setData({
            applyinfo: applyinfo
        })
    },
    toType(e) {
        console.log(e)
        this.setData({
            addTtypes: false
        })
        wx.navigateTo({
            url: `/pages/addInfo/addInfo?id=${e.target.id}&name=${e.target.dataset.name}`,
        })
    },
    onLoad: function(e) {
        app.pageTitle("报名设置")
    },
    saveForm() {
        wx.setStorageSync("applyinfo", this.data.applyinfo)
        wx.navigateBack()
    },
    onShow() {
        if (wx.getStorageSync("applyinfo")) {
            this.setData({
                applyinfo: wx.getStorageSync("applyinfo")
            })
        }
    }
})