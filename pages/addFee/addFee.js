Page({
    data: {
        verifytype: 0,
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: options.edit ? "编辑费用" : "新增费用",
        })
        if (options.edit) {
            let feeList = wx.getStorageSync("activityticket")
            let editItem = feeList[options.id]
            this.setData({
                fee: feeList[options.id],
                verifytype: editItem.verifytype,
                id: options.id,
                feeList: feeList,
                editFee: options.edit
            })
        }
    },

    editFee: function(e) {
        console.log(e)
        let fee = this.data.feeList
        this.setData({
            addForm: true,
            editFee: fee[e.currentTarget.dataset.index],
            editIndex: e.currentTarget.dataset.index
        })
    },
    // changeFee: function(e) {
    //     let value = e.detail.value
    //     this.checkForm(e.detail.value, () => {
    //         let feeList = wx.getStorageSync("activityticket")
    //         feeList[this.data.id] = e.detail.value
    //         feeList[this.data.id].verifytype = this.data.verifytype ? 1 : 0
    //         wx.setStorageSync("activityticket", feeList)
    //         wx.navigateBack()
    //     })
    // },
    createFee: function(e) {
        console.log(e)
        let value = e.detail.value
        this.checkForm(value, () => {
            let feeList = wx.getStorageSync("activityticket")
            if (this.data.editFee) {
                feeList[this.data.id] = value
                feeList[this.data.id].verifytype = this.data.verifytype ? 1 : 0
            } else {
                feeList.push(value)
                feeList.verifytype = this.data.verifytype ? 1 : 0
            }
            wx.setStorageSync("activityticket", feeList)
            wx.navigateBack()
        })
    },
    changSwitch(e) {
        console.log(e)
        this.setData({
            verifytype: e.detail.value,
        })
    },
    checkForm(value, cb) {
        if (value.ticketname === '') {
            wx.showToast({
                title: '请输入费用名称',
                icon: "none",
            })
        } else if (value.price === '') {
            wx.showToast({
                title: '请输费用',
                icon: "none",
            })
        } else if (value.totalcount === '') {
            wx.showToast({
                title: '请输报名人数',
                icon: "none",
            })
        } else {
            cb()
        }
    }
})