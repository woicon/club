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
        console.log(options)
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
            app.tip(`请输入${this.data.title}`)
        } else {
            if (type == 0 || type == 1) {
                cb()
            } else if (type == 2 || type == 3) {
                let option = this.data.types
                let flag = true
                let feilArray = []
                for (let i in option) {
                    if (option[i].value == '') {
                        app.tip("选项不能为空")
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
        }
    },
    saveForm(e) {
        let value = e.detail.value
        this.checkForm(value, () => {
            if (this.data.fieldOption) {
                e.detail.value.fieldOption = this.data.fieldOption
            }
            wx.setStorageSync("customField", value)
            wx.navigateBack()
        })
    },
    onUnload() {
        let currPages = getCurrentPages()
        let currPage = currPages[currPages.length - 2]
        let applyinfo = currPage.data.applyinfo
        applyinfo.push(wx.getStorageSync("customField"))
        wx.setStorageSync("applyinfo", applyinfo)
        currPage.setData({
            applyinfo: applyinfo
        })
    },
    onShow() {

    }
})