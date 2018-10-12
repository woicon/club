let app = getApp()
Page({
    data: {
        orderStatus: [
            {name:'全部'},
            // { id: 6, name: '待审核' },
            // { id: 0, name: '待支付' },
            { id: 1, name: '待参与' },
            { id: 3, name: '已完成' },
        ],
        isBottom: false,
        currentTab: 1,
        pageLoading: true,
        hasMore: true
        //订单状态, 0待支付 1待核销 2核销中 3完成 4取消 5过期 6待审核 7审核失败 8删除 9失败(由于库存不足等原因，进行退款)
    },
    onLoad: function(options) {
        console.log(options)
        this.setData({
            activityId: options.activityId,
            merchantId: options.merchantId,
        })
        app.pageTitle("我的订单")
        this.orderList()
    },
    toggleTab(e) {
        let dataset= e.currentTarget.dataset
        this.setData({
            currentTab: dataset.index
        })
        let status = dataset.id == 'n' ? '' : dataset.id
        this.orderList({
            status:dataset.id || ""
        })
    },
    toOrderDetail(e) {
        console.log(e)
        let dataset = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/memberOrderDetail/memberOrderDetail?id=${dataset.id}`,
        })
    },
    orderParams(args) {
        let arg = args || {}
        let params = {
            page: arg.page || 1,
            size: 20,
            memberId: app.common('memberId')
        }
        if (arg.status){
            params.status = args.status
        }
        return params
    },
    listMore() {
        this.setData({
            isBottom: true
        })
        if (this.data.hasMore) {
            this.orderList({
                page: this.data.page + 1,
                isMore: true
            })
        }
    },
    orderList(args) {
        let arg = args || {}
        this.setData({
            pageLoading: true
        })
        let params = this.orderParams(args)
        app.api.myOrderList(params)
            .then(res => {
                console.log(res)
                if (res.status == '200') {
                    if (arg.isMore) {
                        let _list = this.data.list
                        if (res.data.length > 0) {
                            this.setData({
                                pageLoading: false,
                                list: _list.concat(res.data),
                                page: params.page,
                                isBottom: false
                            })
                        } else {
                            this.setData({
                                pageLoading: false,
                                hasMore: false
                            })
                        }
                    } else {
                        this.setData({
                            pageLoading: false,
                            list: res.data,
                            page: params.page
                        })
                    }
                }
            })
    }
})