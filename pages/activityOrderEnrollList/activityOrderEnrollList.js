let app = getApp()
Page({
    data: {
        isBottom: false,
        pageLoading: true,
        hasMore: true
    },
    onLoad(options) {
        this.setData({
            activityId: options.activityId
        })
        wx.setNavigationBarTitle({
            title: '报名列表',
        })
    },
    listParams(args) {
        let arg = args || {}
        let params = {
            page: arg.page || 1,
            size: 10,
            activityId: this.data.activityId,
        }
        if (arg.nameOrPhone) {
            params.nameOrPhone = arg.nameOrPhone
        }
        return params
    },
    getList(args) {
        let arg = args || {}
        if (arg.nameOrPhone) {
            this.setData({
                pageLoading: true
            })
        }
        app.api.getActivityOrderEnrollList(this.listParams(arg))
            .then(res => {
                console.log(res)
                let list
                let page = arg.page || 1
                let hasMore = (page == res.data.pageCount) ? false : true

                if (arg.isMore) {
                    list = this.data.list
                    let items = list.items
                    list.items = items.concat(res.data.items)
                    list.nextPage = res.data.nextPage
                } else {
                    list = res.data
                }
                this.setData({
                    list: list,
                    pageLoading: false,
                    hasMore: hasMore
                })
                if (res.data.items.length == 0 && arg.nameOrPhone){
                    this.setData({
                        error:'搜索不到报名人信息'
                    })
                }
            })
    },
    listMore(e) {
        this.setData({
            isBottom: true,
        })
        if (this.data.hasMore) {
            this.getList({
                page: this.data.list.nextPage,
                isMore: true
            })
        }
    },
    searchInput(e) {
        this.setData({
            SearchDel: true,
            searchText:e.detail.value
        })
    },
    searchDel() {
        this.setData({
            SearchDel: false,
            searchText:'',
            error:null
        })
        this.getList()
    },
    searchList(e) {
        if (e.detail.value != '') {
            this.getList({
                nameOrPhone: e.detail.value
            })
        }
    },
    onShow: function() {
        this.getList()
    }
})