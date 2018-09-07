let app = getApp()
Page({
    data: {
        pageLoading:true,
        orderStatus:[
            '待支付',
            '未使用',
            '已使用',
            '已取消',
            '已过期',
            '申请退款中',
            '已退款'
        ]
        
    },
    onLoad: function(options) {
        console.log(options)
        this.orderDetail(options)
        app.pageTitle("订单详情")
    },
    onReady: function() {

    },
    orderDetail(params){
        app.api.findActivityOrderDetailById(params)
        .then(res=>{
            console.log(res)
            let detail = (res.status = '200') ? res.data : null
            this.setData({
                detail:detail,
                pageLoading:false
            })
        })
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