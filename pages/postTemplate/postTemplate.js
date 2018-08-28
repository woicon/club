var api = require('../../newApi/newApi.js')
Page({
    data: {
        postType: {
            "exercise": "运动健身",
            "meeting": "商务会议",
            "recreation": "聚会娱乐"
        },
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        currentPost:0

    },
    onLoad: function(options) {
        api.posterTemplate({})
            .then(res => {
                console.log(res)
                let post = res.data
                let postIndex = []
                for (let i in post) {
                    postIndex.push(i)
                }
                let selIndex = postIndex[0]
                this.setData({
                    post: post,
                    postIndex: postIndex,
                    selIndex: selIndex
                })
            })
    },
    postChange(e){
        console.log(e)
        this.setData({
            selIndex: e.detail.currentItemId
        })
    },
    choosePost: function(e) {
        console.log(e)
        this.setData({
            selIndex: e.target.id
        })
    },
    getUrl: function(e) {
        console.log(e)
    },
    onReady: function() {

    },
    onShow: function() {

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