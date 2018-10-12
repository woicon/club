let category = [{
        img: '../../images/yundong@3x.png',
        name: "运动健身",
        id: "exercise",
        ico: "planet"
    },
    {
        img: '../../images/wutai@3x.png',
        name: "聚会娱乐",
        id: "recreation",
        ico: "gamepad1"
    },
    {
        img: '../../images/shanwu@3x.png',
        name: "商务会议",
        id: "meeting",
        ico: "suitcase"
    },
    {
        img: '../../images/qinzi@3x.png',
        name: "亲子幼教",
        id: "offspring",
        ico: "lollipop"
    },
    {
        img: '../../images/yanchu@3x.png',
        name: "赛事演出",
        id: "show",
        ico: "movie"
    },
    {
        img: '../../images/yishu@3x.png',
        name: "文化艺术",
        id: "art",
        ico: "mine"
    },
    {
        img: '../../images/huwai@3x.png',
        name: "户外旅游",
        id: "travel",
        ico: "pictures"
    },
    {
        img: '../../images/peixun@3x.png',
        name: "职业培训",
        id: "train",
        ico: "badge"
    },
]
let postType = {
    art: "文化艺术",
    exercise: "运动健身",
    meeting: "商务会议",
    offspring: "亲子幼教",
    recreation: "聚会娱乐",
    show: "赛事演出",
    train: "职业培训",
    travel: "旅游户外",
}
const activityCategory = {
    1:'亲子', 
    2:'互联网',
    3:'创业',
    4:'职业培训', 
    5:'兴趣培养',
    6:'运动 & 户外', 
    7:'丽人',
    8:'交友',
    9:'演出 & 展览', 
    10:'公益',
    11:'行业活动',
}
const activityStatus = ["待支付", "待核销","核销中","完成","取消","过期","待审核","审核失败","删除","失败"]
module.exports = {
    category: category,
    postType: postType,
    activityStatus: activityStatus,
    activityCategory: activityCategory
}