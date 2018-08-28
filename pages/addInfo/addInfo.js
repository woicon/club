let app = getApp()
Page({
    data: {
        types: [{
            value: ''
        }, {
            value: ''
        }, {
            value: ''
        }]
    },
    onLoad: function(options) {
        console.log(getCurrentPages())
        let currPage = getCurrentPages()
        
        this.setData({
            type: options.id,
            title: options.name
        })
        wx.setNavigationBarTitle({
            title: options.name,
        })
    },
    bindValue(e) {
        let types = this.data.types
        types[e.target.dataset.index].value = e.detail.value
        this.setData({
            types: types
        })
    },
    addCol() {
        let types = this.data.types
        types.push({
            value: ''
        })
        this.setData({
            types: types
        })
    },
    deleteCol(e) {
        let types = this.data.types
        types.splice(e.target.dataset.index, 1)
        this.setData({
            types: types
        })
    },
    checkForm(value, cb) {
        let type = this.data.type
        if (value.name == '') {
            wx.showToast({
                title: `请输入${this.data.title}`,
                icon: 'none'
            })
        }
        if (type == 0 || type == 1) {
            cb()
        }
        if (type == 2 || type == 3) {
            let option = this.data.types
            let flag = true
            let feilArray = []
            for (let i in option) {
                if (option[i].value == '') {
                    wx.showToast({
                        title: `选项不能为空`,
                        icon: 'none'
                    })
                    flag = false
                } else {
                    feilArray.push(option[i].value)
                }
            }
            if (flag) {
                //console.log(feilArray.join("$"))
                this.setData({
                    fieldOption: feilArray.join("$")
                })
                cb()
            }
        }
    },
    saveForm(e) {
        this.checkForm(e.detail.value, () => {
            if (this.data.fieldOption) {
                e.detail.value.fieldOption = this.data.fieldOption
            }
            wx.setStorageSync("customField", e.detail.value)
            let currPage = app.currPage()
            console.log(currPage)
            let infoList = currPage.data.infoList
           // infoList.push(e.detail.value)
            currPage.setData({
                infoList: infoList
            })
            wx.navigateBack()
        })
    },
    onReady: function() {

    },
    onShow() {
        
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