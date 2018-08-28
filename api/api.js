var API = "http://www.51club.com/service/app/"

function ajax(url, parmas, user, method) {
    let loginData = wx.getStorageSync("isLogin")
    let newParmas
    if (!user) {
        let baseParmas = {
            employeeId: loginData.employeeId,
            merchantId: loginData.merchantId
        }
        newParmas = Object.assign(baseParmas, parmas)
    } else {
        newParmas = parmas
    }

    return new Promise((res, rej) => {
        wx.request({
            url: API + url,
            data: newParmas,
            method: method || 'GET',
            success: function(data) {
                res(data.data)
            },
            fail: function(error) {
                rej(error)
            }
        })
    }).catch(err => {
        console.log(err)
        wx.showModal({
            title: 'ERROR',
            content: JSON.stringify(err.errMsg),
        })
    })
}
let apis = {}
let apiList = [
    "login", //登录
    "activityList", //活动列表
    "attendanceRate", //详情
    "activityEnrollList", //已签到
    "verification" //签到
]
for (let i in apiList) {
    apis[apiList[i]] = (parmas, user, method) => ajax([apiList[i]], parmas, user, method)
}
module.exports = apis