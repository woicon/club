// pages/memberOrderApplyInfo/memberOrderApplyInfo.js
const app = getApp()
Page({
    data: {
        selsctItem:0,
    },
    onLoad(options) {
        app.pageTitle("参与者信息")
        this.setData({
            info: wx.getStorageSync("orderApplyInfo")
        })
    },
    selectInfo(e){
        this.setData({
            selsctItem:e.currentTarget.dataset.index
        })
    },
    onShareAppMessage() {

    }
})