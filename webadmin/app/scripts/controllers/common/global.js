/**
 * Created by KellyJia on 2016/10/13.
 */

var wsh = wsh || {};
var sm = sm || {};

wsh.successText = function(text, issuccess, callback) {
    var pop = $('#maskText');
    pop.show().find('.layer_text').text(text);
    pop.find('.cart_p_icon').css({
        display: issuccess ? 'block' : 'none'
    });
    setTimeout(function() {
        typeof callback === 'function' && callback.call(this);
        pop.hide();
    }, 2000);
};



wsh.url = window.location.href.match(/^.+\//)[0];
wsh.getHref = function(string) {
    var reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r) return decodeURI(r[2]);
    return false;
};
sm.bodyHidden = function() {
    $("body").css('overflow', 'hidden');
    $("html").css('overflow', 'hidden');
};
sm.bodyAuto = function() {
    $("body").css('overflow', 'auto');
    $("html").css('overflow', 'auto');
};
sm.goHref = function(url) {
    window.location.href = url;
};
sm.iosSetTitle = function(title) {
    var iframe = document.createElement("iframe");
    iframe.title = title;
    iframe.width = 0;
    iframe.height = 0;
    iframe.setAttribute("src", "images/mycto-logo.png");
    iframe.addEventListener('load', function() {
        setTimeout(function() {
            iframe.removeEventListener('load', function() {});
            document.body.removeChild(iframe);
        }, 0);
    });
    document.body.appendChild(iframe);
};

//激活iso active样式
document.body.addEventListener('touchstart', function() {
    return false;
});


