let app = getApp()
Page({
    data: {
        list: [],
        publicIndex: 1,
        tempTxt: '',
        currentItem: 0
    },
    inputValue: function(e) {
        this.setData({
            tempTxt: e.detail.value
        })
    },
    editTxt(e) {
        let list = this.data.list
        list[e.target.dataset.index].txt = e.detail.value
        this.setData({
            list: list
        })
    },
    addImg: function() {
        this.upImg((img) => {
            let list = this.data.list
            list.push({
                img: img,
                txt: this.data.tempTxt
            })
            this.setData({
                list: list,
                tempTxt: ''
            })
        })
    },
    saveDetail() {
        let currpage = app.currPage()
        var list = this.data.list
        var tempTxt = this.data.tempTxt
        if (list.length > 0) {
            if (tempTxt != '') {
                list.push({
                    txt: tempTxt
                })
            }
            currpage.setData({
                activityDetails: list
            })
            wx.setStorageSync("activityDetails", list)
            wx.navigateBack()
        } else if (list.length == 0 && this.data.tempTxt != '') {
            console.log("sdf")
            list.push({
                txt: tempTxt
            })
            currpage.setData({
                activityDetails: list
            })
            wx.setStorageSync("activityDetails", list)
            wx.navigateBack()
        } else {
            app.tip("请添加活动详情")
        }
    },
    editItem(e) {
        console.log(e)
        this.setData({
            currentItem: e.currentTarget.id
        })
    },
    upImg(cb) {
        wx.chooseImage({
            success(res) {
                app.api.uploadPic(res.tempFilePaths[0], (img) => {
                    cb(img)
                })
            },
        })
    },
    changItem: function(e) {
        this.upImg((img) => {
            let list = this.data.list
            list[e.target.dataset.index].img = img
            this.setData({
                list: list
            })
        })
    },
    deleteItem(e) {
        let list = this.data.list
        list.splice(e.target.dataset.index, 1)
        this.setData({
            list: list
        })
    },
    onLoad: function(options) {
        if (wx.getStorageSync("activityDetails")) {
            this.setData({
                list: wx.getStorageSync("activityDetails")
            })
        }
    },

    onShareAppMessage: function() {

    }
})