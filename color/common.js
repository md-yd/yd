/*搜索*/
function check(){
    var keywords = document.getElementById('keyword').value;
    var postSearch = $("#postSearch").val();
    if (!postSearch) {
        var txt = "请选择搜索分类！";
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);return false;
    };
    if (!keywords) {
        var txt = "请输入搜索关键字！";
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);return false;
    };
}

/*签到*/
function sign(){
    var xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest;
    }else{
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    document.getElementById('sign').innerHTML = '签到中';
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        document.getElementById('sign').innerHTML = '已签到';
        $("#sign").attr("disabled", true);
        window.wxc.xcConfirm(xmlhttp.responseText, window.wxc.xcConfirm.typeEnum.success);
      }
    }
    xmlhttp.open("GET", "/index.php?m=Index&a=sign", true);
    xmlhttp.send();
}

function download(){
    var score = parseInt($("#score").text());
    var need_score = parseInt($("#need_score").text());
    var vip = $("#jsvip").val();
    var id = $("#jsid").val();
    var cid = $("#jscid").val();
    var indate = parseInt($("#indate").val());
    var permanent = parseInt($("#permanent").val());
    var yearvip = parseInt($("#yearvip").val());
    if (vip == 1) {
        if (permanent != 1) {
            window.wxc.xcConfirm("VIP专享资源，请办理VIP会员^_^<br/>&nbsp;<a style='color:blue;' href='/pay/' target='_blank'>点击办理</a>", window.wxc.xcConfirm.typeEnum.warning);return false;
        };
    };
    if (indate == 1 || permanent == 1 || yearvip == 1) {
        if (permanent == 1 && yearvip == 1) {
            var alertContent = "您是本站年费VIP会员，有效期内本站所有资源免费下载！";
        }else if (permanent == 1){
            var alertContent = "您是本站永久VIP会员，本站所有资源免费下载！";
        }else{
            var alertContent = "此次下载免积分！";
        }
    }else{
        if (score < need_score) {
            window.wxc.xcConfirm("亲，积分不够...充值积分后即可下载^_^<br/>&nbsp;<a style='color:blue;' href='/pay/' target='_blank'>点击充值积分</a>", window.wxc.xcConfirm.typeEnum.warning);return false;
        };
        var alertContent = "下载将扣除"+need_score+"积分，确定下载吗？";
    }
    if (confirm(alertContent)) {
        htmlObj = $.ajax({url:"/index.php?m=Index&a=score_download&cid="+cid+"&id="+id,async:false});
        var dataObj = eval("("+htmlObj.responseText+")");
        if (dataObj.tag == 1) {
            window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
            $("#if_need").css("display","block");
            $("#downloadResource").css("display","none");
            $("#pan_url").attr("href", dataObj.url);
            if (dataObj.codes) {
                $("#download_code").css("display","block");
                $("#pan_code").text(dataObj.codes);
            };
        }else{
            window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.error);
        }
    };
}

/*用户登陆/退出*/
$(document).ready(function(){
    $("#userAccount").blur(function(){
        var userAccount = $("#userAccount").val();
        htmlObj = $.ajax({url:"/index.php?m=Index&a=loginCheckAccount&email="+userAccount,async:false}); 
        var dataObj = eval("("+htmlObj.responseText+")");
        if (dataObj.tag) {
           window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.warning);return false;
        };
    })
    $("#user_login").click(function(){
        var userAccount = $("#userAccount").val();
        var userPassword = $("#userPassword").val();
        $("#user_login").text("登录中...");
        $.post("/index.php?m=Index&a=login",{email:userAccount,password:userPassword},function(data, status){
            var dataObj = eval("("+data+")");
            if (dataObj.tag == 0) {
                $("#user_login").text("登录");
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.warning);return false;
            }else{
                window.location.reload();
            }
        });
    })
    $("#userExit").click(function(){
        htmlObj = $.ajax({url:"/index.php?m=Index&a=logout",async:false});
        var dataObj = eval("("+htmlObj.responseText+")");
        if (dataObj.tag) {
            alert(dataObj.msg);
            window.location.reload();
        }else{
            alert(dataObj.msg);
            window.location.href = "/";
        };
    });
    $("#fdEmail").blur(function(){
        var fdEmail = $("#fdEmail").val();
        if (fdEmail) {
            htmlObj = $.ajax({url:"/index.php?m=Index&a=loginCheckAccount&email="+fdEmail,async:false});
            var dataObj = eval("("+htmlObj.responseText+")");
            if (dataObj.tag) {
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.warning);
            };
        }   
    });
    $("#fdButton").click(function(){
        var fdEmail  = $("#fdEmail").val();
        var fdVerify = $("#fdVerify").val();
        if (!fdEmail) {
            var txt = "邮箱不能为空！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);return false;
        };
        if (!fdVerify) {
            var txt = "验证码不能为空！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);return false;
        };
        $.post("/index.php?m=Index&a=findpassword",{email:fdEmail,verify:fdVerify},function(data, status){
            var dataObj = eval("("+data+")");
            if (dataObj.tag) {
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
            }else{
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.warning);
            };
        });
    });
    $("#fdButton3").click(function(){
        var fdEmail  = $("#fdEmail2").val();
        var fdVerify = $("#fdVerify").val();
        if (!fdEmail) {
            var txt = "邮箱不能为空！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);return false;
        };
        if (!fdVerify) {
            var txt = "验证码不能为空！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);return false;
        };
        $.post("/index.php?m=Index&a=activateaccount",{email:fdEmail,verify:fdVerify},function(data, status){
            var dataObj = eval("("+data+")");
            if (dataObj.tag) {
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
            }else{
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.warning);
            };
        });
    });
    $("#fdEmail2").blur(function(){
        var fdEmail = $("#fdEmail2").val();
        if (fdEmail) {
            htmlObj = $.ajax({url:"/index.php?m=Index&a=checkActivation&email="+fdEmail,async:false});
            var dataObj = eval("("+htmlObj.responseText+")");
            if (dataObj.tag) {
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.warning);
            };
        }   
    });
    $("#remail").blur(function(){
        var remail = $("#remail").val();
        if (remail) {
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            if (!reg.test(remail)) {
                var txt = "邮箱格式错误！";
                $("#reg_email").empty();
                $("#reg_email").append("<img src='/Public/images/reg_error.jpg'>&nbsp;"+txt);
            }else{
                htmlObj = $.ajax({url:"/index.php?m=Index&a=regCheckAccount&email="+remail,async:false});
                var dataObj = eval("("+htmlObj.responseText+")");
                if (dataObj.tag) {
                    var txt = "邮箱已被注册！";
                    $("#reg_email").empty();
                    $("#reg_email").append("<img src='/Public/images/reg_error.jpg'>&nbsp;"+txt); 
                }else{
                    window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
                    $("#reg_email").empty();
                    $("#reg_email").append("<img src='/Public/images/reg_correct.jpg'>"); 
                }
            }
        }else{
            var txt = "邮箱不能为空！"; 
            $("#reg_email").empty();
            $("#reg_email").append("<img src='/Public/images/reg_error.jpg'>&nbsp;"+txt);
        }
    });

    $("#rrepassword").focus(function(){
        var rpassword = $("#rpassword").val();
        if (rpassword) {
            if (rpassword.length <= 5) {
                var txt = "密码少于6位！";
                $("#reg_pwd").empty();
                $("#reg_pwd").append("<img src='/Public/images/reg_error.jpg'>&nbsp;"+txt);
            }else{
                $("#reg_pwd").empty();
                $("#reg_pwd").append("<img src='/Public/images/reg_correct.jpg'>&nbsp;");
            }
        }else{
            var txt = "密码不能为空！";
            $("#reg_pwd").empty();
            $("#reg_pwd").append("<img src='/Public/images/reg_error.jpg'>&nbsp;"+txt);
        }
    });

    $("#rnickname").focus(function(){
        var rpassword = $("#rpassword").val();
        var rrepassword = $("#rrepassword").val();
        if (rpassword != rrepassword) {
            var txt = "密码不一致！";
            $("#reg_rpwd").empty();
            $("#reg_rpwd").append("<img src='/Public/images/reg_error.jpg'>&nbsp;"+txt);
        }else{
            $("#reg_rpwd").empty();
            $("#reg_rpwd").append("<img src='/Public/images/reg_correct.jpg'>");
        }
    });

    $("#rverify").focus(function(){
        var rnickname = $("#rnickname").val();
        if (rnickname) {
            if (rnickname.length < 3) {
                var txt = "少于3位！";
                $("#reg_nickname").empty();
                $("#reg_nickname").append("<img src='/Public/images/reg_error.jpg'>&nbsp;"+txt);
            }else{
                $("#reg_nickname").empty();
                $("#reg_nickname").append("<img src='/Public/images/reg_correct.jpg'>");
            }
        }else{
            var txt = "不能为空！";
            $("#reg_nickname").empty();
            $("#reg_nickname").append("<img src='/Public/images/reg_error.jpg'>&nbsp;"+txt);
        }
    });

    /*注册*/
    $("#fdButton2").click(function(){
        var remail = $("#remail").val();
        var rpassword = $("#rpassword").val();
        var rrepassword = $("#rrepassword").val();
        var rnickname = $("#rnickname").val();
        var rverify = $("#rverify").val();
        if (rverify) {
            if (rverify.length != 4) {
                var txt = "请输入右边4位验证码！";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);return false;
            };
        }else{
            var txt = "请输入右边4位验证码！";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);return false;
        }
        $.post("/index.php?m=Index&a=register",{email:remail,password:rpassword,rpassword:rrepassword,verify:rverify,nickname:rnickname},function(data, status){
            var dataObj = eval("("+data+")");
            if (dataObj.tag) {
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
            }else{
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.error);
            }
        });
    })
    /*特效收藏*/
    $("#collection").click(function(){
        var sid = $("#sid").val();
        var tid = $("#tid").val();
        htmlObj = $.ajax({url:"/index.php?m=Member&a=collection&sid="+sid+"&tid="+tid,async:false});
        dataObj = eval("("+htmlObj.responseText+")");
        if (dataObj.tag) {
            window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
        }else{
            window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.error);
        };   
    })
    $("#bindingqq").click(function(){ 
        var email = $("#bindingMail").val();
        var email_yzm = $("#email_yzm").val();
        $("#bindingqq").text("验证中，请稍等...");
        $('#bindingqq').attr('disabled',"true"); 
        //验证邮箱和验证码的合法性
        htmlObj = $.ajax({url:"/index.php?m=Index&a=bindingQW&email="+email+"&email_yzm="+email_yzm,async:false});
        var dataObj = eval("("+htmlObj.responseText+")"); 
        if (dataObj.tag) {
            window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
            $("#bindingqq").text("确定");
            $('#bindingqq').removeAttr("disabled");
        }else{
            $("#bindingqq").text("确定");
            $('#bindingqq').removeAttr("disabled");
            window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.error);
        }
    })
    $("#bindingyouxiang").click(function(){ 
        var email = $("#bindingEmail").val();
        var email_yzm = $("#email_yzm").val();
        var password = $("#password").val();
        var re_password = $("#re_password").val();
        if(password != re_password){
            window.wxc.xcConfirm("前后密码不一致，等检查后重新输入。", window.wxc.xcConfirm.typeEnum.error);
        } else {
            $("#bindingyouxiang").text("验证中，请稍等...");
            $('#bindingyouxiang').attr('disabled',"true"); 
            //验证邮箱和验证码的合法性
            htmlObj = $.ajax({url:"/index.php?m=Index&a=bindingYX&email="+email+"&email_yzm="+email_yzm+"&password="+password+"&re_password="+re_password,async:false});
            var dataObj = eval("("+htmlObj.responseText+")"); 
            if (dataObj.tag) {
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
                $("#bindingyouxiang").text("确定");
                $('#bindingyouxiang').removeAttr("disabled");
            }else{
                $("#bindingyouxiang").text("确定");
                $('#bindingyouxiang').removeAttr("disabled");
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.error);
            }
        }
    })
})

function vipdownload(xuhao){
    htmlObj = $.ajax({url:"/index.php?m=Index&a=checkvip&xuhao="+xuhao,async:false});
    dataObj = eval("("+htmlObj.responseText+")");
    if (dataObj.tag) {
        window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
    }else{
        window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.error);
    };
}

var InterValObj; //timer变量，控制时间  
var count = 120; //间隔函数，1秒执行  
var curCount;//当前剩余秒数  

function sendMessage() {    
　　//向后台发送处理数据  
    var bindingMail = $("#bindingMail").val();
    htmlObj = $.ajax({url:"/index.php?m=Index&a=authCode&email="+bindingMail,async:false});
    dataObj = eval("("+htmlObj.responseText+")");
    if (dataObj.tag) {
        window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
        curCount = count;  
    　　//设置button效果，开始计时  
        $("#btnSendCode").attr("disabled", "true");  
        $("#btnSendCode").val("重新发送验证码(" + curCount + "秒后)");  
        InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
    }else{
        window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.error);
    }
}  

function sendMessage2() {    
　　//向后台发送处理数据  
    var bindingMail = $("#bindingEmail").val();
    htmlObj = $.ajax({url:"/index.php?m=Index&a=sendCodeToEmail&email="+bindingMail,async:false});
    dataObj = eval("("+htmlObj.responseText+")");
    if (dataObj.tag) {
        window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
        curCount = count;  
    　　//设置button效果，开始计时  
        $("#btnSendCode").attr("disabled", "true");  
        $("#btnSendCode").val("重新发送验证码(" + curCount + "秒后)");  
        InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
    }else{
        window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.error);
    }
}

//timer处理函数  
function SetRemainTime() {  
    if (curCount == 0) {                  
        window.clearInterval(InterValObj);//停止计时器  
        $("#btnSendCode").removeAttr("disabled");//启用按钮  
        $("#btnSendCode").val("重新发送验证码");  
    }else{  
        curCount--;  
        $("#btnSendCode").val("重新发送验证码(" + curCount + "秒后)");  
    }  
}  

//申请扒模板
function weburl(){
    var weburl = $("#weburl").val();
    var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(Expression);
    if(objExp.test(weburl) != true){
        window.wxc.xcConfirm("网址格式错误，请重新输入！", window.wxc.xcConfirm.typeEnum.warning);
        return false;
    }else{
        $.post("/index.php?m=Index&a=bamoban", {weburl:weburl}, function(data, status){
            var dataObj = eval("("+data+")");
            if (dataObj.tag == 0) {
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }else{
                window.wxc.xcConfirm(dataObj.msg, window.wxc.xcConfirm.typeEnum.success);
                return false;
            }
        })
    }
}

document.onkeydown=function(){
    var e = window.event||arguments[0];
    if(e.keyCode==123){
        return false;
    }else if((e.ctrlKey)&&(e.shiftKey)&&(e.keyCode==73)){
        return false;
    }else if((e.ctrlKey)&&(e.keyCode==85)){
        return false;
    }else if((e.ctrlKey)&&(e.keyCode==83)){
        return false;
    }
}
document.oncontextmenu=function(){
    return false;
}