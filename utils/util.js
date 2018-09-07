//XML转JSON
var xmlToJSON = require('../libs/xmlToJSON/xmlToJSON.js')
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    //second
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
//XML转JSON 
function XMLtoJSON(xml) {
    var myOptions = {
        normalize: false,
        mergeCDATA: false,
        xmlns: true,
        grokText: false,
        textKey: false,
        grokAttr: false,
        childrenAsArray: false,
        stripAttrPrefix: false,
        stripElemPrefix: false,
        normalize: false,
        attrsAsObject: false
    }
    return xmlToJSON.xmlToJSON.parseString(xml, myOptions);
}
module.exports = {
    formatTime: formatTime,
    xmlToJSON: xmlToJSON
}