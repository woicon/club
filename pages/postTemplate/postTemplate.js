let app = getApp()
Page({
    data: {
        postType: {
            art: "文化艺术",
            exercise: "运动健身",
            meeting: "商务会议",
            offspring: "亲子幼教",
            recreation: "聚会娱乐",
            show: "赛事演出",
            train: "职业培训",
            travel: "旅游户外",
        }
    },
    onLoad: function(options) {
        app.pageTitle("选择模板")
        wx.showLoading()
        app.api.posterTemplate({})
            .then(res => {
           
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
                wx.hideLoading()
            })
    },
    postChange(e) {
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
    getUrl(e) {
        console.log(e)
        let img = e.currentTarget.dataset.url
        this.setData({
            postImg: img
        })
        let currPage = getCurrentPages()
        let _currPage = currPage[currPage.length - 2]
        console.log(_currPage)
        _currPage.setData({
            postImg: img
        })
        wx.navigateBack()
    }
})