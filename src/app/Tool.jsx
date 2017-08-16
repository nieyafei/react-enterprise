import { browserHistory} from 'react-router';
import merged from 'obj-merged';
import * as config from './Config';
import Util from './common/Util';
import 'whatwg-fetch';//fetch访问
import 'es6-promise';
import {Toast} from "antd-mobile";
import ajax from '@fdaciuk/ajax';
const {target} = config;
const Tool = {};

/*
*
* fetch ajax
* */
var refreshNumer=0;
Tool.fetchAjax = function (mySetting) {
    var setting = {
        url: window.location.pathname,
        method:"GET",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:"",
        dataType:"json",
        mode:"basic",//basic:正常请求   cors   no-cors跨域请求     opaque 非cors下的跨域请求，无法判断是否成功和获取数据
        success: function (text) { }, //请求成功执行方法
        error: function () { } //请求失败执行方法
    }
    for (var attr in mySetting) {
        setting[attr] = mySetting[attr];
    }
    if(JSON.parse(Tool.localItem("User"))){
        setting["headers"].append("X-Authorization",Tool.localItem("User")?("Bearer "+JSON.parse(Tool.localItem("User")).token):"Bearer ");
    }

    /*
    * 分为访问接口POST,GET，
    * 返回类型text()字符串,json()json对象,fromDate()对象,blob对象，arrayBuffer()二进制数组
    * */
    var result;
    if(setting.method == "POST"){
        /*POST 提交*/
        result = fetch(setting.url,{
            credentials: 'include',
            method:"POST",
            headers:setting["headers"],
            body:setting.body,
            mode:setting.mode
        })
        result.then(res => {
            return returnDate(res);
        }).then(text=> {
            return setting.success(text);
        }).catch(err=>{
            return setting.error('数据出错了');
        })
        /*result.then(function (response) {
            if(response.ok){
                return returnDate(response);
            }
        }).then(function(obj){
            console.log(obj)
            return setting.success(obj);
        }).catch(function () {
            return setting.error('ajax出错了');
        });*/
    }else{
        result = fetch(setting.url+setting.body,{
            credentials: 'include',
            method:"GET",
            headers:setting.headers,
            mode:setting.mode
        })
        result.then(res => {
            /*if(res.status==401){
                /!* token失效 *!/
                console.log(12535879)
                res.json().then(data=> {
                    if(data.serror.type=="TOKEN_EXPIRED"){
                        Tool.refreshToken();
                        return null;
                    }
                });
            }*/
            return returnDate(res);
        }).then(text=> {
            return setting.success(text);
        }).catch(err=>{
            return setting.error('数据出错了');
        })
    }
    function returnDate(response){
        if(setting.dataType == "text"){
            return response.text();
        }else if(setting.dataType == "json"){
            return response.json();
        }else if(setting.dataType == "fromDate"){
            return response.fromDate();
        }else if(setting.dataType == "blob"){
            return response.blob();
        }else if(setting.dataType == "arrayBuffer"){
            return response.arrayBuffer();
        }
    }
}
/*
* ajax接口
* */
Tool.fAjax = function (mySetting) {
    var setting = {
        url: window.location.pathname,
        method:"GET",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:"",
        dataType:"json",
        mode:"basic",//basic:正常请求   cors   no-cors跨域请求     opaque 非cors下的跨域请求，无法判断是否成功和获取数据
        success: function (text) { }, //请求成功执行方法
        error: function () { } //请求失败执行方法
    }
    for (var attr in mySetting) {
        setting[attr] = mySetting[attr];
    }

    /*
     * 分为访问接口POST,GET，
     * 返回类型text()字符串,json()json对象,fromDate()对象,blob对象，arrayBuffer()二进制数组
     * */
    /*var header = {
            'Accept': 'application/json','content-type': 'application/json',
            "X-Authorization":Tool.localItem("User")?("Bearer "+JSON.parse(Tool.localItem("User")).token):""
        }*/
    setting.headers["X-Authorization"] = Tool.localItem("User")?("Bearer "+JSON.parse(Tool.localItem("User")).token):"";
    var result = ajax({
        method: setting.method,
        url: setting.url,
        data:setting.body,
        headers:setting.headers
    })
    result.then(function (res,xhr) {
        return setting.success(res);
    }).catch((error,xhr) => {
        if(xhr.status==401 || xhr.status==403){
            Tool.removeLocalItem('User');
            Toast.info("Token过期，请重新登录",1,function () {
                Tool.localItem("prevPathName",window.location.pathname + window.location.search);
                browserHistory.push("/login");
                return ;
            });
        }
        return setting.error('数据出错了');
    });
}


/**
 * 封装ajax post请求
 * @param {string} pathname 服务器请求地址
 * @param {string} body     发送给服务器的数据
 * @param {object} headers     发送给服务器的数据
 * @param {string} dataType  请求成功执行方法
 * @param {string} mode    请求失败执行方法
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.fetchPost = function (pathname, body,headers,dataType, mode,success,error) {
    if(typeof headers === "object" && !(headers instanceof Array)){
        var hasProp = false;
        for (var prop in headers){
            hasProp = true;
            break;
        }
        if (!hasProp){
            headers = {
                'Accept': 'application/json','content-type': 'application/json'
            };
        }
    }
    var setting = {
        url: target + pathname,
        method:"POST",
        headers:headers,
        body:body,
        dataType:dataType,
        mode:mode,
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.fAjax(setting);
};
/**
 * 封装ajax get请求
 * @param {string} pathname 服务器请求地址
 * @param {string} body     发送给服务器的数据
 * @param {object} headers     发送给服务器的数据
 * @param {string} dataType  请求成功执行方法
 * @param {string} mode    请求失败执行方法
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.fetchGet = function (pathname, body,headers,dataType, mode,success,error) {
    if(typeof headers === "object" && !(headers instanceof Array)){
        var hasProp = false;
        for (var prop in headers){
            hasProp = true;
            break;
        }
        if (!hasProp){
            headers = {
                'Accept': 'application/json',"Content-Type" : "text/plain"
            };
        }
    }
    var url=target + pathname;
    if(pathname.indexOf("http://")>-1){
        url = pathname;
    }
    var setting = {
        url: url,
        method:"GET",
        headers:headers,
        body:body,
        dataType:dataType,
        mode:mode,
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.fAjax(setting);
};

/**
 * 发送ajax请求和服务器交互
 * @param {object} mySetting 配置ajax的配置
 */
Tool.ajax = function (mySetting) {

    var setting = {
        url: window.location.pathname, //默认ajax请求地址
        async: true, //true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false
        type: 'GET', //请求的方式
        data: {}, //发给服务器的数据
        dataType: 'json',
        success: function (text) { }, //请求成功执行方法
        error: function () { } //请求失败执行方法
    };


    var aData = []; //存储数据
    var sData = ''; //拼接数据
    //属性覆盖
    for (var attr in mySetting) {
        setting[attr] = mySetting[attr];
    }
    for (var attr in setting.data) {
        aData.push(attr + '=' + filter(setting.data[attr]));
    }
    sData = aData.join('&');
    setting.type = setting.type.toUpperCase();

    var xhr = new XMLHttpRequest();
    try {
        if (setting.type == 'GET') { //get方式请求
            sData = setting.url + '?' + sData;
            xhr.open(setting.type, sData + '&' + new Date().getTime(), setting.async);
            xhr.send();
        } else { //post方式请求
            xhr.open(setting.type, setting.url, setting.async);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(sData);
        }
    } catch (e) {
        return httpEnd();
    }

    if (setting.async) {
        xhr.addEventListener('readystatechange', httpEnd, false);
    } else {
        httpEnd();
    }

    function httpEnd() {
        if (xhr.readyState == 4) {
            var head = xhr.getAllResponseHeaders();
            var response = xhr.responseText;
            //将服务器返回的数据，转换成json

            if (/application\/json/.test(head) || setting.dataType === 'json' && /^(\{|\[)([\s\S])*?(\]|\})$/.test(response)) {
                response = JSON.parse(response);
            }

            if (xhr.status == 200) {
                setting.success(response, setting, xhr);
            } else {
                setting.error(setting, xhr);
            }
        }
    }
    xhr.end = function () {
        xhr.removeEventListener('readystatechange', httpEnd, false);
    }

    function filter(str) { //特殊字符转义
        str += ''; //隐式转换
        str = str.replace(/%/g, '%25');
        str = str.replace(/\+/g, '%2B');
        str = str.replace(/ /g, '%20');
        str = str.replace(/\//g, '%2F');
        str = str.replace(/\?/g, '%3F');
        str = str.replace(/&/g, '%26');
        str = str.replace(/\=/g, '%3D');
        str = str.replace(/#/g, '%23');
        return str;
    }
    return xhr;
};
/**
 * 封装ajax post请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.post = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'POST', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};
/**
 * 封装ajax get请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.get = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'GET', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};

/**
 * 跨域封装ajax get请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Tool.getKY = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'GET', //请求的方式
        data: data, //发给服务器的数据
        dataType:"jsonp",
        jsonp:"callback",
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Tool.ajax(setting);
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
        };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 格式化时间
 * 
 * @param {any} t
 * @returns
 */
Tool.formatDate = function (str) {
    var date = new Date(str);
    var time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return '';
    } else if (time / 1000 < 60) {
        return '刚刚';
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前';
    } else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前';
    } else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前';
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前';
    } else {
        return parseInt(time / 31536000000) + '年前';
    }
}

Tool.formatDateTime = function(str,type){
    if(type==1){
        return new Date(str*1000).format("yyyy-MM-dd HH:mm:ss");
    }else{
        return new Date(str*1000).format("yyyy-MM-dd");
    }
}

/**
 * 本地数据存储或读取
 * 
 * @param {any} key
 * @param {any} value
 * @param company string 公司名称
 * @param fieldList string 选择的领域
 * @param user  用户信息
 * @param typeFlag  登录true false
 * @returns
 */
Tool.localItem = function (key, value) {
    if (arguments.length == 1) {
        return localStorage.getItem(key);
    } else {
        return localStorage.setItem(key, value);
    }
}


/**
 * 删除本地数据
 * 
 * @param {any} key
 * @returns
 */
Tool.removeLocalItem = function (key) {
    if (key) {
        return localStorage.removeItem(key);
    }
    return localStorage.removeItem();
}

/*
* 获取cookie
* */
Tool.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
/*
* 存储cookie
* */
Tool.setCookie = function (name,value) {
    var Days = 30;
    var d = new Date();
    d.setTime(d.getTime() + (Days*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = name + "=" + value + "; " + expires+";path=/;";
}
/*
* 删除cookie xinghan.scientistin.com
* */
Tool.delCookie = function (name) {
    document.cookie = name + "=;expires=" + (new Date(0)).toGMTString()+";path=/;";
    //Tool.setCookie("tk","");
}
Tool.setSession = function(key,data){
    try {
        sessionStorage.setItem(key,JSON.stringify(data))
    }catch(err){
        sessionStorage.setItem(key,data)
    }
}

Tool.getSession = function(key){
    let value=null;
    try {
        value=JSON.parse(sessionStorage.getItem(key))
    }catch(err){
        value=sessionStorage.getItem(key)
    }
    return value;
}

Tool.delSession = function(key){
    if (Array.isArray(key)){
        for (var i=0,l=key.length;i<l;i++){
            sessionStorage.removeItem(key[i]);
        }
    }else {
        sessionStorage.removeItem(key);
    }
}
/* 重新刷新获取token */
Tool.refreshToken = function(){
    refreshNumer++;
    if(refreshNumer>2){return;}
    Tool.fetchGet(Util.getApi("refreshToken"),"",{},'json','basic',
        (res) => {
            if(res.result){
                //dispatch();获取数据返回给state
            }
        }, (err) => {
            console.log(err);
        });
}

/* 设置滚动条位置 */
Tool.setScrollTop=(str,tabName)=>{
    let dataSearchScroll= Tool.getSession(str)||[];
    let indexTy=dataSearchScroll.findIndex(function(value, index, arr) {
        return value.tabName == tabName;
    });
    let scroll=indexTy==-1?0:dataSearchScroll[indexTy].scroll;
    console.log(scroll);
    setTimeout(function(){
        document.body.scrollTop=document.documentElement.scrollTop=scroll
    },300)
}
//使用Promise主要是为了组件没卸载的时候能准确的先设置滚动条位置再返回之前版块的滚动条位置
Tool.saveScroll=(str,tabName)=>{
    return new Promise((resolve, reject) => {
        let dataSearchScroll= Tool.getSession(str)||[];
        let obj={};
        obj.tabName=tabName;
        obj.scroll=document.body.scrollTop||document.documentElement.scrollTop;
        let indexIf=dataSearchScroll.findIndex(function(value, index, arr) {
            return value.tabName == tabName;
        });
        if(indexIf !== -1){
            dataSearchScroll[indexIf]=obj
        }else {
            dataSearchScroll.push(obj)
        }
        /* 开始插入数据 */
        Tool.setSession(str,dataSearchScroll);
        document.body.scrollTop=document.documentElement.scrollTop=0
        resolve()
    });
}

export { Tool, merged, config }