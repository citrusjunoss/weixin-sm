(function() {
    'use strict';

    angular.module("webApp").controller("timeSelectController", timeSelectController);

    function timeSelectController($scope, commonServ, $filter, HOST) {
        (function($) {
            var datejs = new Date(),
                year = datejs.getUTCFullYear(),
                month = datejs.getUTCMonth() + 1,
                day = datejs.getUTCDate(),
                currentZero = new Date(year + '-' + month + '-' + day + ' 0:0:0').getTime();

            $scope.isActive = true;
            $scope.defaultDay = true; //默认时间样式
            var objDate = {
                startDate: '',
                endDate: ''
            };
            $scope.setDate = function(val) {
                var getDate = new Date(new Date().getTime() - (val - 1) * 86400000);
                var nowDate = new Date(new Date().getTime());
                $scope.defaultDay = true;
                if (val === 7) {
                    $scope.isActive = true;
                } else if (val === 30) {
                    $scope.isActive = false;
                }
                $('#startDateJs').attr('value', getDate.getUTCFullYear() + '-' + (getDate.getUTCMonth() + 1) + '-' + getDate.getUTCDate());
                $('#endDateJs').attr('value', nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1) + '-' + nowDate.getUTCDate());
                $('#startDateJs').mobiscroll().date('setDate', new Date( getDate.getUTCFullYear(),getDate.getUTCMonth(),getDate.getUTCDate()), true);
                $('#endDateJs').mobiscroll().date('setDate', new Date( nowDate.getUTCFullYear(),nowDate.getUTCMonth(),nowDate.getUTCDate()), true);
            }
            $scope.setDate(7);

            function calendar(elm) {
                $(elm).mobiscroll().date({
                    minDate: new Date(year - 3, month - 1, day),
                    maxDate: new Date(),
                    preset: 'date',
                    display: 'bottom',
                    mode: 'scroller',
                    lang: 'zh',
                    dateFormat: 'yyyy-m-d',
                    dateOrder: 'yyyymd',
                    onSelect: function(event, inst) {
                        $scope.defaultDay = false;
                    },
                    onBeforeShow: function(argument) {
                        var nowDate = new Date(new Date().getTime());
                        $('#startDateJs').mobiscroll().date('setDate', new Date( nowDate.getUTCFullYear(),nowDate.getUTCMonth(),nowDate.getUTCDate()), true);
                        $('#endDateJs').mobiscroll().date('setDate', new Date( nowDate.getUTCFullYear(),nowDate.getUTCMonth(),nowDate.getUTCDate()), true);
                    }
                });

            }
            calendar('#startDateJs');
            calendar('#endDateJs');



            $scope.subData = function() {

                var start_time = $('#startDateJs').val();
                var end_time = $('#endDateJs').val();
                var timeSpace = currentZero - new Date(start_time).getTime();
                console.log(timeSpace);
                if (new Date(end_time).getTime() - new Date(start_time).getTime() > (30 * 24 * 60 * 60 * 1000)) {
                    wsh.successText('开始时间和结束时间间隔不能大于30天');
                } else if (new Date(end_time).getTime() == new Date(start_time).getTime()) {
                    wsh.successText('开始时间不能等于结束时间');
                } else if (start_time == '' || end_time == '') {
                    wsh.successText('开始时间和结束时间不能为空');
                } else if (new Date(start_time).getTime() > new Date(end_time).getTime()) {
                    wsh.successText('开始时间不能晚于结束时间');
                } else {
                    if (timeSpace == (29 * 24 * 60 * 60 * 1000) || timeSpace == (6 * 24 * 60 * 60 * 1000)) {
                        $scope.defaultDay = true; //默认时间样式
                        window.location.href = '/mycto/allstatistics?start_time=' + start_time + '&end_time=' + end_time + '&defaultDay=' + $scope.defaultDay;
                    } else {
                        $scope.defaultDay = false; //默认时间样式
                        window.location.href = '/mycto/allstatistics?start_time=' + start_time + '&end_time=' + end_time + '&defaultDay=' + $scope.defaultDay;
                    }
                }

            }
        })(Zepto);

    }

    timeSelectController.$inject = ['$scope', 'commonServ', '$filter', 'HOST'];

})();
