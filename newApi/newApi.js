function api(API) {
    function ajax(url, parmas, method, user) {
        console.log(`${url}：PARMAS==>`, parmas)
        return new Promise((res, rej) => {
            wx.request({
                url: API + url,
                data: parmas,
                method: "POST" || method,
                header: {
                    ['content-type']: method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
                },
                success: function(data) {
                    console.log(`${url} CALLBACK==>`, data)
                    res(data.data)
                },
                fail: function(error) {
                    console.error(`%c${url}：：ERROR`, "font-size:13px;", error)
                    rej(error)
                }
            })
        }).catch(err => {
            console.log(err)
            if (err.errMsg = "request:fail") {
                wx.showModal({
                    title: '网络连接失败',
                    content: "请您检查网络连接设置",
                    showCancel: false
                })
            } else {
                wx.showModal({
                    title: 'ERROR',
                    content: " JSON.stringify(err.errMsg)",
                    showCancel: false
                })
            }
        })
    }
    let apis = {}
    let apiList = [
        //票券审核接口集合 : Ticketcheck Controller
        "applet/v1/passCheck", //票券通过审核
        "applet/v1/rejectCheck", //票券拒绝
        "applet/v1/ticketCheckList", //票券审核列表
        //发布活动接口集合 : Publish Activity Controller
        "applet/v1/publishActivity", //发布活动
        //"applet/v1/uploadPic", //上传图片
        "applet/v1/wechatRegister", //小程序注册
        "applet/v1/posterTemplate", //海报模板
        //资料设置和留言接口集合 : Data Leave Message Controller
        "applet/v1/dataSet", //资料设置
        "applet/v1/messageList", //留言列表
        "applet/v1/messageReply", //留言回复
        "applet/v1/selectData", //资料查询
        //活动管理接口集合 : Activity Manage Controller
        "applet/activityDetail", //活动详情
        "applet/activityList", //活动列表
        "applet/activityOrderList", //活动订单列表
        "applet/activityShare", //活动分享
        "applet/findActivityOrderDetailById", //订单详情/报名详情
        "applet/findSignInfoBySignCode", //查询签到信息
        "applet/getActivityOrderEnrollList", //活动报名列表
        "applet/verificationTicketByOrderId", //核销票券
        //商户认证提现接口集合 : Merchant Related Controller
        "applet/certificationAudit", //认证审核
        "applet/findMerchantAccount", //查询账户余额
        "applet/getAuthorizeResultById", //认证结果查询
        "applet/getMemberList", //查询会员列表
        "applet/saveAuthorizeInfo", //保存认证信息
        "applet/withdraw", //提现
        "applet/sendVerifyCode", //发送手机验证码
        "applet/bindingMobilePhone", //绑定手机号
    ]
    for (let i in apiList) {
        let apiKey = apiList[i].split('/').pop()
        apis[apiKey] = (parmas, method, user) => ajax([apiList[i]], parmas, method, user)
    }
    //上传文件
    apis.uploadPic = (tempFilePaths, cb) => {
        wx.showLoading({
            title: '上传中',
        })
        wx.uploadFile({
            url: `${API}applet/v1/uploadPic`,
            filePath: tempFilePaths,
            name: 'uploadPic',
            fail(error) {
                console.log(error)
                wx.showToast({
                    title: error,
                    icon: "none"
                })
            },
            success(res) {
                let data = JSON.parse(res.data)
                cb(data.data)
            },
            complete() {
                wx.hideLoading()
            }
        })
    }
    return apis
}
module.exports = api