// pages/applyPerson/applyPerson.js
let app = getApp(),
  form = ""
Page({
  data: {
    items: [{
      name: 'USA',
      value: '美国'
    },
    {
      name: 'CHN',
      value: '中国',
      checked: 'true'
    },
    {
      name: 'BRA',
      value: '巴西'
    },
    {
      name: 'JPN',
      value: '日本'
    },
    {
      name: 'ENG',
      value: '英国'
    },
    {
      name: 'TUR',
      value: '法国'
    },
    ],
    curentIndex: 0,
    responseList: [],
    form: {},
    msg: '',
    radioTxt: '',
    checkTxt: '',
    selNum: 0,
    personNum:1  //活动报名人数
  },
  onLoad: function (options) {
    app.pageTitle("填写报名人信息");
    let orderParams = wx.getStorageSync("orderParams"),
        applyDetail = wx.getStorageSync("applyDetail"),
        responseList = applyDetail.activityEnrollInfoResponseList
    console.log(orderParams.num)
    for (var i = 0; i < responseList.length; i++) {
      let arr = [];
      if (responseList[i].fieldOption != null) {
        arr.push(responseList[i].fieldOption.split("$"))
        responseList[i].fieldOption = arr
      }
      if (responseList[i].fieldType == 2) {
        this.setData({
          radioTxt: arr[0][0]
        })
      }
      if (responseList[i].fieldType == 3) {
        this.setData({
          checkTxt: arr[0][0]
        })
      }
    }
    this.data.responseList = responseList
    form = {
      activityId: applyDetail.id,
      orderPrice: orderParams.price,
      payPrice: orderParams.price,
      //orderType : 0,
      ticketCount: orderParams.num,
      memberId: 65837,  //app.common("id"),//会员id
      merchantId: applyDetail.merchantId,
      channelId: applyDetail.activityChannel.id,//渠道id
      inventoryId: orderParams.inid,  //库存id
      ticketId: orderParams.id //票Id
    }
    this.setData({
      responseList: responseList,
      form: form,
      personNum:orderParams.num
    })
    // form = this.data.form
  },
  radioChange(e) {
    this.setData({
      radioTxt : e.detail.value
    })
  },
  checkChange(e) {
    this.setData({
      checkTxt : e.detail.value.join("$")
    })
  },
  bindPickerChange(e) {
    this.setData({
      selNum: parseInt(e.detail.value)
    })
  },
  formSubmit(e) {
    let arrTxt = [], arr = [], _this = this,arrXml="";
    form = this.data.form
    arrTxt.push(e.detail.value)
    let flag = false
    this.data.responseList.forEach(function (item, i) {
      if (item.fieldType == 0 || item.fieldType == 1) {
        item.fieldOption = `${arrTxt[0]["name" + i]}`
      } else if (item.fieldType == 2) {
        item.fieldOption = _this.data.radioTxt
      } else if (item.fieldType == 3) {
        item.fieldOption = _this.data.checkTxt
      } else if (item.fieldType == 4) {
        item.fieldOption = parseInt(_this.data.selNum) + 1
      }
      if (item.status == 0){
        app.tip(`请输入${item.name}`) 
        flag = true 
      }
      arr.push(`<field><name>${item.name}</name><value>${item.fieldOption}</value><type>${item.type}</type><sequence>${item.infoSequence}</sequence><fieldtype>${item.fieldType}</fieldtype></field>`)
    })
    if(flag==false){
      console.log(flag)
      arrXml=`[{"enrollXml":'<enrollInfo>${arr.join("")}</enrollInfo>'}]`
      form.enrollInfos = arrXml
      form.contactsName = arrTxt[0]["name0"]
      form.contactsPhone = arrTxt[0]["name1"]
      this.setData({
        form: form
      })
      console.log(this.data.form)
      app.api.createAppletOrder(this.data.form).then((res) => {
         //wx.navigateTo({
           //url:'/pages/activityDetails/activityDetails?data='+res.data,
         //})
        console.log(res.data)
      })
    }
  }
})