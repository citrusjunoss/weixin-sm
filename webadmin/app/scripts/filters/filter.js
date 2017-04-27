/**
 * Created by KellyJia on 2016/10/19.
 */
(function(){
  'use strict';
  angular.module('webApp').filter('trustFilter', trustFilter)
    .filter('trust', trust)//$sce过滤器
    .filter('showStatus', showStatus);//$sce过滤器
  function trustFilter($sce) {
    return function (val, str) {
      switch (str) {
        case 'html':
          return $sce.trustAsHtml(val.replace('undefined', '').replace('null', ''));
        case 'js':
          return $sce.trustAsJs(val);
        case 'css':
          return $sce.trustAsCss(val);
        case 'url':
          return $sce.trustAsUrl(val);
        case 'resourceUrl':
          return $sce.trustAsResourceUrl(val);
        default :
          return '未可知';
      }
    };
  }

  trustFilter.$inject = ['$sce'];
  function trust($sce) {
    return function (val, str) {
      switch (str) {
        case 'html':
          return $sce.trustAsHtml(val);
        case 'js':
          return $sce.trustAsJs(val);
        case 'css':
          return $sce.trustAsCss(val);
        case 'url':
          return $sce.trustAsUrl(val);
        case 'resourceUrl':
          return $sce.trustAsResourceUrl(val);
        default :
          return '未可知';
      }
    };

  }

  trust.$inject = ['$sce'];
  function showStatus() {
    return function (status) {
      switch (status) {
        case '1':
          return '新客户';
        case '2':
          return '意向客户';
        case '3':
          return '已成交客户';
      }
    }
  }
})();
