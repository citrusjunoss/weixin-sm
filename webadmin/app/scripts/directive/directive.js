(function () {
  'use strict';
  var wsh = wsh || {};
  wsh.dialog = null; //弹框全局变量
  wsh.getLength = function (str) {
    var length = 0;
    if (str) {
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          length += 2;
        } else {
          length++;
        }
      }
    }
    return length;
  };
  angular.module('webApp')
    .directive('regCharLen', regCharLen);//校验字符长度

  /**
   * @desc 校验字符长度
   *
   * @param
   * ng-model * 必填
   * name * 必填
   * ng-trim * 必填 [Boolean] 是否去前后空格 默认true
   * diff-zh [Boolean] 是否区别中文 默认false
   * reg-char-len [Number] 最大长度 默认16
   * prompt-msg * 必填 [String] 提示信息
   * prompt-type [Number] 提示类型 默认1 （1.您还能输入40个字符、 2.当前已输入0个字符，您还能输入40个字符）
   *
   * @return
   * formName.inputName.$error.exceed 超出最大字符数时为true
   *
   * @example
   * <input type="text" class="form-control" ng-model="tagname" name="tagname" placeholder="不能超过40个字符或20个汉字" reg-char-len="40" prompt-msg="promptMsg" prompt-type="1" ng-trim="false" diff-zh="true" required>
   * <span class="inline padding5" ng-class="{'red':namemy.tagname.$error.exceed}" ng-bind="promptMsg"></span>
   */
  function regCharLen() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        promptMsg: '='
      },
      link: function (scope, elem, attrs, ngModelCtrl) {

        var charLen = 0;//输入的字符长度
        var maxLen = parseInt(attrs.regCharLen) || 16;//最大长度
        var subfix = attrs.diffZh === 'true' ? '字符' : '字';//后缀
        var prefix = attrs.promptType === '2' ? '当前已输入' + charLen + '个' + subfix + '，' : '';//前缀

        //校验长度
        function validateLen(viewValue) {
          viewValue = viewValue || '';
          charLen = attrs.diffZh === 'true' ? wsh.getLength(viewValue) : viewValue.length;//如果区别中文
          if (charLen <= maxLen) {
            if (charLen === maxLen && !viewValue.trim()) {
              scope.promptMsg = '您输入的数据有误';
              ngModelCtrl.$setValidity('exceed', false);
            } else {
              prefix = attrs.promptType === '2' ? '当前已输入' + charLen + '个' + subfix + '，' : '';//前缀
              scope.promptMsg = prefix + '您还能输入' + (maxLen - charLen) + '个' + subfix;
              ngModelCtrl.$setValidity('exceed', true);
            }
          } else {
            scope.promptMsg = '您已输入超过' + maxLen + '个' + subfix;
            ngModelCtrl.$setValidity('exceed', false);
          }
          return viewValue;
        }

        //$parsers管道添加校验函数
        ngModelCtrl.$parsers.push(validateLen);

        //在渲染页面前校验字符长度
        ngModelCtrl.$render = function () {
          elem.val(validateLen(ngModelCtrl.$viewValue));
        };
      }
    };
  }
 
})();
