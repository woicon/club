// pages/memberPassword/memberPassword.js
let app = getApp()
Page({
    data: {
        checkPassword: '',
        password: '',
        isRight:false
    },
    onLoad(options) {
        app.pageTitle("修改账户密码")
    },
    pasBlur(e) {
        console.log(e)
        if (!app.check.password(e.detail.value)) {
            app.tip("请输入6-20位数字字母组合的密码")
        }
    },
    checkInput(e) {
        let password = this.data.password
        this.setData({
            checkPassword: e.detail.value
        })
        if (app.check.password(password) && password === e.detail.value){
            this.setData({
                isRight:true
            })
        }
    
    },
    passwordInput(e) {
        this.setData({
            password: e.detail.value
        })
    },
    changePassword(e) {
        if (this.data.password == '') { 
            app.tip("请输入密码")
        } else if (this.data.checkPassword == '') {
            app.tip("请输入确认密码")
        } else if (this.data.password != this.data.checkPassword) {
            app.tip("两次密码输入不一致")
        } else {
            wx.showLoading({
                title: '密码修改中',
            })
            app.api.updatePassword({
                merchantId: app.common("merchantId"),
                password: this.data.checkPassword
            })
                .then(res => {
                    wx.hideLoading()
                    if(res.status == '200'){
                        app.tip(res.data)
                        wx.navigateBack()
                    }else{
                        app.tip(res.msg)
                    }
                })
        }
    },
})