let app = getApp()
Page({
    data: {
        orderStatus: {
            1: '未使用',
            3: '已使用',
            0: '待支付',
            6: '待参与',
            7: '已完成'
        },
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
        app.pageTitle("订单管理")
        this.orderList()
    },
    toggleTab(e) {
        this.setData({
            currentTab: e.currentTarget.dataset.id
        })
        this.orderList({
            status: e.currentTarget.dataset.id
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