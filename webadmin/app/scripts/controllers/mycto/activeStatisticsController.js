(function() {
    'use strict';
    angular.module("webApp").controller("activeStatisticsController", activeStatisticsController);

    function activeStatisticsController($scope, commonServ, $filter, HOST, $location) {

        // 列表显示
        $scope.menuShow = false;
        // 时间默认七天样式
        $scope.isActive = false;

        //屏幕平均分成多少宽
        var screenNum = $(window).width() / 6;

        //查询名称
        $scope.searchName = '参与活动次数';

        // 传参
        var param = {
            user_id: '',
            type: 1,
            start_time: '',
            end_time: ''
        }
        param.user_id = $location.search().user_id ? $location.search().user_id : '';

        // 时间
        var datejs = new Date(),
            year = datejs.getFullYear(),
            month = datejs.getMonth() + 1,
            day = datejs.getDate();


        // 查看时间函数
        $scope.setDate = function(val) {
            $scope.menuShow = false; //隐藏下拉菜单
            var gDate = new Date(new Date().getTime() - (val - 1) * 86400000);
            var nowDate = new Date(new Date().getTime());
            var startTime = gDate.getUTCFullYear() + '-' + (gDate.getUTCMonth() + 1) + '-' + gDate.getUTCDate();
            var endTime = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1) + '-' + nowDate.getUTCDate();
            param.start_time = startTime; //始时间
            param.end_time = endTime; //结束时间

            if (val === 7) {
                $scope.isActive = false;
            } else {
                $scope.isActive = true;
            }
            getDate();
        }

        // 默认查询7天
        $scope.setDate(7);

        // 选择类别
        $scope.selectItem = function(val) {
            if (val === 1) {
                param.type = 1;
                $scope.menuShow = false;
            } else {
                param.type = 2;
                $scope.menuShow = false;
            }
            if (param.type === 1) {
                $scope.searchName = '参与活动次数';
            } else if (param.type === 2) {
                $scope.searchName = '参与人数';
            }
            getDate();
        }

        // 曲线配置
        var columnOption = {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            loading: {
                hideDuration: 1000,
                showDuration: 1000
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                gridLineWidth: 0
            },
            legend: {
                align: 'center',
                // x: -30,
                verticalAlign: 'top',
                symbolRadius: 0,
                itemMarginTop: 10,
                itemMarginBottom: 10,
                y: -10,
                //floating: true,
                shadow: false,
                itemStyle: {
                    color: '#000',
                    fontWeight: 'normal',
                    fontSize: '10px'
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: [],
            credits: {
                enabled: false
            }
        }

        // 楼盘配置
        var pieOption = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                plotBackgroundColor: ['red']
            },
            loading: {
                hideDuration: 1000,
                showDuration: 1000
            },
            title: {
                text: '',
                align: ' left'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                symbolRadius: 0,
                itemMarginTop: 10,
                y: 50
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        distance: 30,
                        format: '{point.percentage:.1f}%',
                        style: {
                            'color': '#000'
                        },
                        verticalAlign: 'center'
                    },
                    showInLegend: true,
                    colors: ['#4e7fbb', '#be4f4c', '#99b958', '#7e63a0']
                }
            },
            series: [{
                type: 'pie',
                name: '楼盘',
                data: null
            }],
            credits: {
                enabled: false
            }
        }

        // 接口
        function getDate() {
            // 统计
            commonServ.post({
                url: HOST + '/broker/user-data',
                param: param,
                success: function(data) {
                    $scope.columnData = data.errmsg.data;
                    var arrTime = [];
                    if ($scope.columnData.date.length > 0) {
                        console.log($scope.columnData);
                        // 曲线数据显示
                        for (var i = 0; i < $scope.columnData.date.length; i++) {
                            arrTime.push($filter('date')(new Date($scope.columnData.date[i]), 'MM-dd'));
                        }
                        columnOption.xAxis.max = $scope.columnData.date.length - 1;
                        columnOption.chart.width = screenNum * columnOption.xAxis.max;
                        columnOption.xAxis.categories = arrTime;
                        columnOption.series = $scope.columnData.cuountData;
                        Highcharts.chart('columndata', columnOption);
                    }
                }
            });

            //楼盘
            commonServ.post({
                url: HOST + '/broker/house-data',
                param: param,
                success: function(data) {
                    $scope.pieData = data.errmsg.data;
                    //console.log($scope.pieData);
                    // 曲线数据显示
                    if ($scope.pieData.length > 0) {
                        pieOption.series[0].data = $scope.pieData;
                        Highcharts.chart('piedata', pieOption);
                    }
                }
            });
        }

        getDeatil();

        function getDeatil() { //获取用户信息
            commonServ.post({
                url: HOST + '/staff/client-info',
                param: {
                    id: $location.search().user_id
                },
                success: function(data) {
                    $scope.wxUserInfo = data.errmsg.data.wxusersex;
                }
            })
        };


    }

    activeStatisticsController.$inject = ['$scope', 'commonServ', '$filter', 'HOST', '$location'];
})();
