let app = getApp();
Page({
  data: {
    isPX: app.isPX,
    price: 0,
    current: 0,
    datecurrent: 0,
    intcurrent: 0,
    maxlen: 1,
    num: 1,
    array: [],
    form: {
      ticketTitle: '请选择票种',
      timeTitle: '请选择时间',
      intervalTitle: '可选时段',
    },
    orderParams: {},
    activityTimeList: [],
    intervalArr: [],
    ipx: '',
    weekArr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    detail: '',
    isHide: true,
    isShow: true,
    price: "0.00" //共计
  },
  setDate(startDate, endDate,flag) {
    let timeList = []
    let start = startDate.split(" ")[0], //活动开始日期
      syear = start.split("-")[0], smonth = start.split("-")[1], sday = start.split("-")[2],
      end = endDate.split(" ")[0], //活动结束日期
      eyear = end.split("-")[0], emonth = end.split("-")[1], eday = end.split("-")[2],
      sTime = new Date()
    sTime.setFullYear(syear, smonth - 1, sday)
    let startT = sTime.getTime()
    let eTime = new Date()
    eTime.setFullYear(eyear, emonth - 1, eday)
    let sDay = sTime.getDate(),
      endT = eTime.getTime(),
      diffTime = Math.floor((endT - startT) / (24 * 3600 * 1000)),
      begin, last
    if (diffTime < 0) {
      begin = sDay + diffTime
      last = sDay;
    } else {
      begin = sDay
      last = sDay + diffTime
    }
    for (let i = begin; i <= last; i++) {
      let mydate = new Date(startT)
      mydate.setDate(i);
      let date = `${mydate.getFullYear()}-${mydate.getMonth() + 1}-${mydate.getDate()}`
      if(flag==true){
        timeList.push(`${date}`)
      }else{
        timeList.push(`${app.converDate(date, true)}`)
      }
      
    }
    return timeList;
  },
  getInterval(date) {
    let arr = [], list = this.data.detail.activityTimeList
    if (list.length > 1) {
      list.forEach(function (item, x) {
        if (item.startDate.split(" ")[0] == date) {
          arr.push(`${item.startTime}~${item.endTime}`)
        }
      })
    } else {
      arr.push(`${list[0].startTime}~${list[0].endTime}`)
    }
    return arr
  },
  onLoad: function (options) {
    let detail = wx.getStorageSync("applyDetail"), _this = this,
      orderParams = this.data.orderParams
    //console.log(detail)
    //this.data.detail = detail
    orderParams.activityId = detail.id
    orderParams.num = 1
    orderParams.activityTicketList = detail.activityTicketList
    orderParams.id = detail.activityTicketList[this.data.current].id//设置票id默认选项
    orderParams.ticketName = detail.activityTicketList[this.data.current].ticketName//设置票默认选项
    orderParams.price = detail.activityTicketList[this.data.current].price//设置票价格默认选项
    orderParams.payPrice = detail.activityTicketList[this.data.current].price//设置票价格默认选项
    orderParams.ticketType = detail.activityTicketList[this.data.current].ticketType //
    orderParams.inid = detail.activityTicketList[this.data.current].activityTicketInventory[0].id //库存id
    app.pageTitle("选择票价")
    let timeList = [], intervalArr = []
    if (detail.activityTimeList.length == 1) {
      let week = detail.activityTimeList[0].applicableWeek
      if(week=="" || week==null){
        timeList = this.setDate(detail.activityTimeList[0].startDate, detail.activityTimeList[0].endDate)
      }else{
        let setWeek = week.split(","),
        weekDate = this.setDate(detail.activityTimeList[0].startDate, detail.activityTimeList[0].endDate,true)
        weekDate.forEach(function(item,i){
          let getday = new Date(Date.parse(`${item}`)).getDay()
          for(var i=0;i<setWeek.length;i++){
            if (setWeek[i] == getday){
              timeList.push(`${app.converDate(item, true)}  ${_this.data.weekArr[getday]}`)
            }
          }
        })
      }
      orderParams.time = timeList[0] //设置默认已选时间
      let sInterval = detail.startDate.split(" ")[1], //默认时间段
          eInterval = detail.endDate.split(" ")[1]
      orderParams.interval = `${sInterval}~${eInterval}`
      intervalArr.push(`${sInterval}~${eInterval}`)
    } else {
      detail.activityTimeList.forEach(function (item, x) {
        timeList.push(item.startDate.split(" ")[0])
      })
      timeList = Array.from(new Set(timeList))
      intervalArr = _this.getInterval(timeList[0])
    }
    let prix = (orderParams.price *  this.data.num ).toFixed(2)
    console.log(prix)
    this.setData({
      detail:detail,
      orderParams: orderParams,
      intervalArr: intervalArr,
      form: {
        ticketTitle: '已选：',
        timeTitle: '已选：',
        intervalTitle: '已选：'
      },
      activityTimeList: timeList,
      maxlen: orderParams.activityTicketList[0].maxBuy,
      ipx: app.isPX ? 'mt50' : '',
      price: prix
    })
  },
  checkTicket(e) {
    let orderParams = {
      ticketType: e.currentTarget.dataset.index,
      ticketName: e.target.dataset.name,
      id: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price,
      inid: e.currentTarget.dataset.inid
    }
    let price = e.currentTarget.dataset.price,
      prix = (price * this.data.num).toFixed(2)
    this.data.form.ticketTitle = "已选："
    orderParams = this.data.orderParams
    let form = this.data.form
    this.setData({
      orderParams: orderParams,
      form: form,
      current: e.currentTarget.dataset.index,
      maxlen: e.currentTarget.dataset.count,
      price: prix
    })
  },
  checkedDate(e) {
    let timeType = e.currentTarget.dataset.type,
      time = e.currentTarget.dataset.time,
      form = this.data.form,
      orderParams = this.data.orderParams
    if (timeType == "0") {
      this.data.orderParams.time = e.currentTarget.dataset.time
      this.data.form.timeTitle = "已选："
      this.setData({
        datecurrent: e.currentTarget.dataset.index,
        intervalArr: this.getInterval(time)
      })
    } else {
      let sTime = e.currentTarget.dataset.stime,
        eTime = e.currentTarget.dataset.etime,
        interval = e.currentTarget.dataset.interval
      this.data.orderParams.interval = `${interval}`
      this.data.form.intervalTitle = "已选："
      this.setData({
        intcurrent: e.currentTarget.dataset.index
      })
    }
    this.setData({
      form: form,
      orderParams: orderParams
    })
  },
  moreDate(e) {
    let flag = e.currentTarget.dataset.show
    if (flag == "true") {
      this.setData({
        isHide: false,
        isShow: false
      })
    } else {
      this.setData({
        isHide: true,
        isShow: true
      })
    }
  },
  bindChange(e) {
    let num = this.data.num
    if (e.currentTarget.dataset.type == "plus") {
      if (num >= this.data.maxlen) {
        app.tip(`最多选择${this.data.maxlen}张`)
      } else {
        num = num + 1
      }
    } else {
      if (num <= 1) {
        app.tip(`最少选择1张`)
      } else {
        num = num - 1
      }
    }
    this.data.orderParams.num = num
    let orderParams = this.data.orderParams
    let price = orderParams.price,
      prix = (price * num).toFixed(2)
    this.setData({
      num: num,
      orderParams: orderParams,
      price: prix
    })
  },
  toApplyPerson(e) {
    wx.setStorageSync("orderParams", this.data.orderParams);
    wx.navigateTo({
      url: '/pages/applyPerson/applyPerson',
    })
  }
})