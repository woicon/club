Page({
    data: {
        switchs: false,
        verifytype: 0,
        switchFee: true,
        feeList: [{
            price: 0,
            ticketname: "默认费用项",
            totalcount: "100000",
            verifytype: 0
        }]
    },
    
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '活动费用编辑',
        })
    },

    addForm: function() {
        wx.setStorageSync("activityticket", this.data.feeList)
        wx.navigateTo({
            url: '/pages/addFee/addFee',
        })
    },

    toggleFee: function(e) {
        let switchFee = this.data.switchFee
        this.setData({
            switchFee: !switchFee
        })
    },
    resetFee: function() {
        this.setData({
            addForm: false,
            editFee: null
        })
    },
    editFee(e) {
        console.log(e.currentTarget.dataset.index)
        wx.navigateTo({
            url: `/pages/addFee/addFee?id=${e.currentTarget.dataset.index}&edit=true`
        })
    },
    deleteFee: function(e) {
        console.log(e)
        let feeList = this.data.feeList
        // delete feeList[e.currentTarget.dataset.index]
        feeList.splice(e.currentTarget.dataset.index, 1)
        console.log(feeList)
        this.setData({
            feeList: feeList
        })
        wx.setStorageSync("activityticket", feeList)
    },
    onShow: function() {
        if (wx.getStorageSync("activityticket")) {
            this.setData({
                feeList: wx.getStorageSync("activityticket")
            })
        }
    },
    saveFee(){
        wx.navigateBack()
    }
})