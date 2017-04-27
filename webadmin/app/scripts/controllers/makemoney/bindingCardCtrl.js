/**
 * Created by CaimingLiao 2016/12/17;
 **/
(function () {
  'use strict';
  angular.module('webApp').controller('bindingCardCtrl', bindingCardCtrl);

  function bindingCardCtrl($scope, commonServ, HOST, $location) {
    var isAjax = true;
    var images = {
      localId: '',
      serverId: ''
    };
    var config = {};
    $scope.ajaxData = {
      id: '',
      real_name: '',
      mobile: '',
      idnumber: '',
      bank_branch: '',
      idnumber_front: '',
      idnumber_back: '',
      bankcard_front: '',
      card_no: ''
    };
    getCardInfo();

    commonServ.post({
      url: HOST + '/weixin/url-sign',
      param: {url: window.location.href},
      success: function (data) {
        config = data.errmsg;
        weixinApi(config);
      },
      error: function (data) {
      }
    });
    $scope.cardSave = function () {

      if (!$scope.ajaxData.real_name) {
        return wsh.successText('请输入账户名');
      }
      if (!$scope.ajaxData.mobile) {
        return wsh.successText('请输入手机号码');
      } else {
        if (!(/^1[0-9]{10}$/).test($scope.ajaxData.mobile)) {
          return wsh.successText('请输入正确的手机号码');
        }
      }
      if (!$scope.ajaxData.idnumber) {
        return wsh.successText('请输入身份证');
      }
      if (!$scope.ajaxData.bank_branch) {
        return wsh.successText('请输入开户行');
      }
      if (!$scope.ajaxData.card_no) {
        return wsh.successText('请输入银行卡号');
      }
      if (!$scope.ajaxData.idnumber_front) {
        return wsh.successText('请上传身份证正面照片');
      }
      if (!$scope.ajaxData.idnumber_back) {
        return wsh.successText('请上传身份证反面照片');
      }
      if (!$scope.ajaxData.bankcard_front) {
        return wsh.successText('请上传银行卡照片');
      }
      var data = angular.copy($scope.ajaxData);
      if (isAjax) {
        var url = '';
        isAjax = false;//禁止提交
        //保存方法
        commonServ.post({
          url: HOST + '/broker/bound-banks',
          param: data,
          success: function (data) {
            wsh.successText("提交成功");
            return window.location.href = '/makemoney/personal';
          },
          error: function (data) {
            return wsh.successText(data.errmsg);
            isAjax = false;//允许提交
          }
        })
      }
    };

    function weixinApi(config) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.appid, // 必填，公众号的唯一标识
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.noncestr, // 必填，生成签名的随机串
        signature: config.signature,// 必填，签名，见附录1
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
      $scope.isLoading = {
        display: 'none'
      }
    }

    $scope.uploadImage = function (cardType) {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          images.localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          wx.uploadImage({
            localId: images.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
              images.serverId = res.serverId; // 返回图片的服务器端ID
              upload(images.serverId, cardType);
            },
            fail: function (res) {
              return wsh.successText(JSON.stringify(res))
            }
          });
        }
      });
    };
    function upload(ids, cardType) {
      commonServ.post({
        url: HOST + '/document/upload',
        param: {serverId: ids},
        success: function (data) {
          if (cardType == 'idnumber_front') {
            $scope.ajaxData.idnumber_front = data.errmsg.file_cdn_path;
          } else if (cardType == 'idnumber_back') {
            $scope.ajaxData.idnumber_back = data.errmsg.file_cdn_path;
          } else if (cardType == 'bankcard_front') {
            $scope.ajaxData.bankcard_front = data.errmsg.file_cdn_path;
          }
          //$scope.ajaxData.cardType = data.errmsg.file_cdn_path;

        },
        error: function (data) {
          return wsh.successText(data.errmsg)
        }
      })
    }


    //绑定成功后获取用户信息
    function getCardInfo() {
      commonServ.post({
        url: HOST + '/broker/isbound-banks',
        success: function (data) {
          if(data.errmsg != ""){
            $scope.ajaxData.id = data.errmsg ? data.errmsg.data.id : '';
            $scope.ajaxData.real_name = data.errmsg?data.errmsg.data.real_name:'';
            $scope.ajaxData.mobile = data.errmsg?data.errmsg.data.mobile:'';
            $scope.ajaxData.idnumber = data.errmsg?data.errmsg.data.idnumber:'';
            $scope.ajaxData.bank_branch = data.errmsg?data.errmsg.data.bank_branch:'';
            $scope.ajaxData.idnumber_front = data.errmsg?data.errmsg.data.idnumber_front:'';
            $scope.ajaxData.idnumber_back =data.errmsg?data.errmsg.data.idnumber_back:'';
            $scope.ajaxData.bankcard_front = data.errmsg?data.errmsg.data.bankcard_front:'';
            $scope.ajaxData.card_no = data.errmsg?data.errmsg.data.card_no:'';
          }
        },
        error: function () {

        }
      })
    }

  }

  bindingCardCtrl.$inject = ['$scope', 'commonServ', 'HOST', '$location'];
})();
