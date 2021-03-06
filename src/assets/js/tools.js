/**
 * @Author: Jzy
 * @Date: 2017/12/12
 * @Last Modified by: Jzy
 * @Last Modified time: 2017/12/12
 */
function cloneObj (obj){
    let str, newobj = obj.constructor === Array ? [] : {}
    if (typeof obj !== 'object'){
        return
    } else if (window.JSON){
        str = JSON.stringify(obj) //系列化对象
        newobj = JSON.parse(str)  //还原
    } else {
        for(let i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]
        }
    }
    return newobj
}

function getRandom(a, b){
    return Math.floor(Math.random() * (b - a + 1)) + a
}

function addCookie(name, value, expDays, domain, path, secure){
    let date = new Date()
    date.setTime(date.getTime() + parseInt(expDays) * 1000 * 60 * 60 * 24)
    let cookie = name + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString()
    cookie += domain ? ';domain=' + domain : ''
    cookie += path ? ';path=' + path : ''
    cookie += secure ? ';secure' : ''
    document.cookie = cookie
}

function getCookie(name){
    let m = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)')
    return (m && m[1]) ? decodeURIComponent(m[1]) : ''
}

function prefixCss(obj, prefixFeature, value){
    let prefix = prefixFeature.slice(0, 1).toUpperCase() + prefixFeature.slice(1)
    let prefixArr = ['webkit' + prefix, 'moz' + prefix, 'ms' + prefix, prefixFeature]
    for (let i = 0; i < prefixArr.length; i++){
        obj.style[prefixArr[i]] = value
    }
}

function getUrlHash(){
    return window.location.hash.slice(1) || ''
}

function getSearchParams(){
    const search = window.location.search
    let dataObj  = {}
    if (search.indexOf('?') != -1){
        let str = decodeURIComponent(search.substr(1))
        let strs = str.split('&')
        for (let i = 0; i < strs.length; i++){
            dataObj[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
        }
    }
    return dataObj
}

function setSearchParams(params){
    const search = window.location.search
    let str  = search.indexOf('?') == -1 ? '?' : '&'
    let _arr = []
    for (let i in params){
        _arr.push(i + '=' + encodeURIComponent(params[i]))
    }
    return str + _arr.join('&')
}

function recursionTree(arr, callback){
    if (Array.isArray(arr)){
        for (let i = 0; i < arr.length; i++){
            callback && callback(arr[i])
            recursionTree(arr[i].children, callback)
        }
    }
}

export { cloneObj, getRandom, addCookie, getCookie, prefixCss, getUrlHash, getSearchParams, setSearchParams, recursionTree }
