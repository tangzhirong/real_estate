// Custom addons for pre handle the request
var extend = require('util')._extend;
module.exports = function(req,res,next) {
    res.formatReply  = function(err_code, msg, data) {
        var appendData = data || {};
        var obj = {'error': err_code, 'msg': msg};
        obj = extend(obj, appendData);
        var httpCodeMap = {
            "0" : 200,
            "1001" : 500,
            "1002" : 500,
            "1003" : 403,
            "1009" : 500,
        };
        var httpCode = httpCodeMap[err_code] || 403;
        this.status(httpCode).send(obj);
    };
    // 快捷回复
    // err_code, 0是没有问题, >0 都是有对应的错误参数与原因
    // m1, String, 错误原因
    // m2, Object, 额外的回复信息
    res.f = function(err_code, m1, m2) {
        var msg, obj;
        var msgMap = {
            "0" : "ok",
            "1001" : "duplicate uid",
            "1002" : "params error",
            "1003" : "no auth",
            "1004" : "verifyCode not send",
            "1006" : "code error",
            "1007" : "save failed",
            "1008" : "update failed",
            "1009" : "find failed",
            "1010" : "create failed",
            "1011" : "duplicate handle",
            "1012" : "vote too much times",
            "1013" : "can't vote self",
        };
        if(typeof(m1)=='string'){
            msg = m1;
            obj = m2 || {};
        }else if(typeof(m1)=='object' || !m1){
            obj = m1 || {};
            msg = msgMap[err_code.toString()] || 'no msg';
        }
        res.formatReply(err_code, msg, obj);
    };
    next();
};