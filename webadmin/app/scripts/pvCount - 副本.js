window.onload = function () {
    getid();
    function getid() {
        $.ajax({
            type: "POST",
            dataType: "json",
            data:{url:window.location.href,go_url:window.location.href},
            url: 'http://wx.api.vkdvip.com/weixin/url-sign',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success:function (data) {
                if(data.errcode == 3){
                    window.location.href = data.data.url;
                }else if(data.errcode == 0){
                    var corpid = data.errmsg.corp_id;
                    wxConfig = data.errmsg;
                    pvCount(corpid);
                    delToken();
                }
            }
        })
    }
    function pvCount(id) {
        $.ajax({
            type: "POST",
            dataType: "json",
            data:{path:window.location.pathname,corp_id:id,go_url:window.location.href},
            url: 'http://wx.api.vkdvip.com/statistics/page-log',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success:function (data) {
                if(data.errcode == 3){
                    window.location.href = data.data.url;
                }else if(data.errcode == 0){

                }
            }
        })
    }

    function delToken() {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxConfig.appid, // 必填，公众号的唯一标识
            timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: wxConfig.noncestr, // 必填，生成签名的随机串
            signature: wxConfig.signature,// 必填，签名，见附录1
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        var $viewImg = $('#js-viewcontent').find('img');
        var $viewImgSrc = [];
        $viewImg.each(function(){
              $viewImgSrc.push(this.src);
        });
        $viewImg.on("click", function() {  
            wx.previewImage({
                current: this.src,
                urls: $viewImgSrc
            });
        });
    }

};

