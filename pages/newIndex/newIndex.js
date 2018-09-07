let app = getApp()
Page({
    data: {
        types: [{
                img: '../../images/yundong@3x.png',
                name: "运动健身",
                id: "exercise",
                ico: "planet"
            },
            {
                img: '../../images/wutai@3x.png',
                name: "聚会娱乐",
                id: "recreation",
                ico: "gamepad1"
            },
            {
                img: '../../images/shanwu@3x.png',
                name: "商务会议",
                id: "meeting",
                ico: "suitcase"
            },
            {
                img: '../../images/qinzi@3x.png',
                name: "亲子幼教",
                id: "offspring",
                ico: "lollipop"
            },
            {
                img: '../../images/yanchu@3x.png',
                name: "赛事演出",
                id: "show",
                ico: "movie"
            },
            {
                img: '../../images/yishu@3x.png',
                name: "文化艺术",
                id: "art",
                ico: "mine"
            },
            {
                img: '../../images/huwai@3x.png',
                name: "户外旅游",
                id: "travel",
                ico: "pictures"
            },
            {
                img: '../../images/peixun@3x.png',
                name: "职业培训",
                id: "train",
                ico: "badge"
            },
        ],
        postType: {
            art: "文化艺术",
            exercise: "运动健身",
            meeting: "商务会议",
            offspring: "亲子幼教",
            recreation: "聚会娱乐",
            show: "赛事演出",
            train: "职业培训",
            travel: "旅游户外",
        },
        pageLoading: true
    },
    onLoad(options) {
        app.api.posterTemplate({})
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
                    pageLoading: false
                })
            })
    },
    pay() {
        wx.requestPayment({
            "timeStamp": "1536145844164", "nonceStr": "F1DsdZyj1HiwywS8", "signType": "MD5", "paySign": "84EE3715B754FD2C5F9CB26456515DC2", "package": "prepay_id=wx051910441254896f4f0fcbec3027875733",
            success: (res) => {
                console.log(res)
            },
            fail: (error) => {
                console.log(error)
            }
        })
    },
    creatAct(e) {
        console.log(e)
        let post = this.data.post
        let img = post[e.currentTarget.id][0]
        wx.removeStorageSync("activityDetails")
        wx.removeStorageSync("editActivity")
        wx.removeStorageSync("applyInfo")
        wx.navigateTo({
            url: `/pages/creatActivity/creatActivity?img=${img}&label=${e.currentTarget.dataset.label}`,
        })
    },
    onShareAppMessage: function() {

    },
})