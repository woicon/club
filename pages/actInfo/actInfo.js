// pages/actInfo/actInfo.js
Page({
    data: {
        // status 状态0 必填  1 选填  2 删除 
        infoList: [
            {name: "姓名",type:1,status:0}, 
            {name: "手机号",type:2,status:0}
        ],
        infoType:[
            {name: "身份证号",type:3,status:0},
            {name: "微信", type: 0, status:0},
            { name: "公司", type: 0, status: 1 },
            { name: "职位", type: 0, status: 1 },
            { name: "行业", type: 0, status: 1 },
            { name: "年龄", type: 0, status: 1 },
            { name: "邮箱", type: 0, status: 1 },
            { name: "护照", type: 0, status: 1 },
        ],
        addTtypes:false 
    },
    
    toggleItem(){
        this.setData({
            addTtypes: !this.data.addTtypes
        })
    },

    selectType: function (e) {
        console.log(e)
        let infoList = this.data.infoList
        let infoType = this.data.infoType
        infoList.push(e.target.dataset.type)
        infoType.splice(e.target.dataset.index, 1)
        this.setData({
            infoList: infoList,
            addTtypes: false,
            infoType: infoType
        })
    },
    deleteType(e){
        console.log(e)
        let infoList = this.data.infoList
        let infoType = this.data.infoType
        infoType.push(e.target.dataset.type)
        infoList.splice(e.target.dataset.index,1)
        this.setData({
            infoList: infoList,
            infoType: infoType
        })
    },
    toggleSwitch(){
        console.log(e)
         let infoList = this.data.infoList
        let infoType = this.data.infoType
        infoType.push(e.target.dataset.type)
        infoList.splice(e.target.dataset.index, 1)
        this.setData({
            infoList: infoList,
            infoType: infoType
        })
    },
    changeSwitch(e){
        console.log(e)
        let infoList= this.data.infoList
        infoList[e.target.dataset.index].status  = e.detail.value ? 0 : 1
        this.setData({
            infoList: infoList
        })
    },
    toType(e){
        console.log(e)
        this.setData({
            addTtypes:false
        })
        wx.navigateTo({
            url: `/pages/addInfo/addInfo?id=${e.target.id}&name=${e.target.dataset.name}`,
        })
    },
    onLoad: function(e) {
  
    },

    onReady: function() {

    },

    onShow() {
        // if (wx.getStorageSync("customField")) {
        //     console.log("s")
        //     let infoList = this.data.infoList
        //         infoList.push(wx.getStorageSync("customField"))
        //     this.setData({
        //         infoList: infoList
        //     })
        // }
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