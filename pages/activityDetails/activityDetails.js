let app = getApp()
Page({
    data: {
        actStatus: {
            0: "进行中",
            1: "已关闭",
            2: "已删除",
            3: "已结束",
        },
    },
    getDetail(id) {
        app.api.activityDetail({
            id:id
        }).then(res=>{
            console.log(res)
            this.setData({
                detail:res.data
            })
        })
    },
    onShow() {
        this.getDetail(609)
    },
    onShareAppMessage: function() {

    }
})