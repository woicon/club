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
    onLoad(options) {
        console.log(options)
        this.setData({
            type: options.id,
        })
       
        if(options.edit){
            this.initEdit(options)
        }else{
            app.pageTitle(options.name)
        }
    },
    initEdit(options){
        let editInfo = wx.getStorageSync("editCol")
        if (editInfo.fieldType == 2 || editInfo.fieldType == 3){
            let typesArr = editInfo.fieldOption.split('$')
            let types = []
            for (let i in typesArr){
                types.push({ value: typesArr[i]})
            }
            this.setData({
                types:types
            })
        }
        console.log(0 || 'we')
        this.setData({
            info: editInfo,
            edit:true,
            index: options.index
        })
        app.pageTitle("编辑报名项")

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
        console.log(e.detail.value)
        let value = e.detail.value
        this.checkForm(value, () => {
            if (this.data.fieldOption) {
                e.detail.value.fieldOption = this.data.fieldOption
            }
          //  wx.setStorageSync("customField", value)
            let currPages = getCurrentPages()
            let currPage = currPages[currPages.length - 2]
            let applyInfo = currPage.data.applyInfo
            if(this.data.edit){
                applyInfo[this.data.index] = value
            }else{
                applyInfo.push(value)
            }
            wx.setStorageSync("applyInfo", applyInfo)
            currPage.setData({
                applyInfo: applyInfo
            })

            wx.navigateBack()
        })
    },
    onUnload() {
        // if (wx.getStorageSync("customField")) {
        //     let currPages = getCurrentPages()
        //     let currPage = currPages[currPages.length - 2]
        //     let applyInfo = currPage.data.applyInfo
        //     applyInfo.push(wx.getStorageSync("customField"))
        //     wx.setStorageSync("applyInfo", applyInfo)
        //     currPage.setData({
        //         applyInfo: applyInfo
        //     })
        // }
    },
    onShow() {

    }
})