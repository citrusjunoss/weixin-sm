(function() {
    'use strict';

    angular.module("webApp").controller("allStatisticsController", allStatisticsController);

    function allStatisticsController($scope, commonServ, $filter, HOST, $location) {

        // 列表显示
        $scope.menuShow = false;
        
        //屏幕平均分成多少宽
        var screenNum = $(window).width()/6;


         //传参
        var param = {
            type: 1,
            start_time: '',
            end_time: ''
        }

        $scope.linedata = '';
        $scope.pieData = '';

        $scope.menuShow = false;
        $scope.searchName = '参与活动次数';
        //查询类型样式变化
        $scope.objType = true;
        
        // 时间
        var datejs = new Date(),
            year = datejs.getFullYear(),
            month = datejs.getMonth() + 1,
            day = datejs.getDate();

            var gDate = new Date(new Date().getTime() - (6) * 86400000);
            var nowDate = new Date(new Date().getTime());

            var startTime = gDate.getUTCFullYear() + '-' + (gDate.getUTCMonth()+1) + '-' + gDate.getUTCDate();
            var endTime = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth()+1) + '-' + nowDate.getUTCDate();

            param.start_time= $location.search().start_time ? $location.search().start_time : startTime; //开始时间
            param.end_time = $location.search().end_time ? $location.search().end_time : endTime; //结束时间
            console.log(new Date(param.end_time).getTime() - new Date(param.start_time).getTime());
            // 时间默认七天样式
            if(new Date(param.end_time).getTime() - new Date(param.start_time).getTime() > (6 * 24 * 60 * 60 * 1000)){
                $scope.isActive  = true;
            }else{
                $scope.isActive  = false;
            }
            
       

        $scope.setDate = function(val) {

            $scope.menuShow = false; //隐藏下拉菜单
            if(val>0){
                gDate = new Date(new Date().getTime() - (val-1) * 86400000);
                param.start_time= gDate.getUTCFullYear() + '-' + (gDate.getUTCMonth()+1) + '-' + gDate.getUTCDate(); //始时间
                param.end_time = endTime; //结束时间
            }
         
            if(val===7){ //查看7天数据
               $scope.isActive  = false;
               $scope.defaultDay = true;
            }else if(val === 30){   //查看30天数据
                $scope.isActive  = true;
                $scope.defaultDay = true;
            }else {
                $scope.defaultDay = $location.search().defaultDay ? $location.search().defaultDay : true;
            }

            getDate();
        }

        // 默认查询7天
        $scope.setDate();

        // 选择类别
        $scope.selectItem = function(val) {
            $scope.menuShow = false; //隐藏下拉菜单
            $scope.isActive  = false; //7天时间样式
            param.start_time= startTime; //开始时间
            param.end_time = endTime; //结束时间
            if (val === 1) {
                param.type = 1;
                $scope.objType = true;
                $scope.searchName = '参与活动次数';
            } else {
                param.type = 2;
                $scope.objType = false;
                $scope.searchName = '参与人数';
            }
            $scope.setDate();
        }

        // 曲线配置
        var lineOption = {
            chart: {
                type: 'spline'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            loading: {
                hideDuration: 1000,
                showDuration: 1000
            },
             tooltip: {
                enabled: true,
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            xAxis: {
                categories: [],
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            legend: {
                align: 'center',
                enabled: false
            },
            colors: ['#cd4e4d'],
            plotOptions: {
                spline: {
                    dataLabels: {
                        enabled: true,
                    },
                   // enableMouseTracking: false
                }
            },
            series: [{
                name: null,
                data: []
            }],
            credits: {
                enabled: false
            }
        };

        // 楼盘数据
        var pieOption = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0,
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
            commonServ.post({
                url: HOST + '/broker/user-data-by-agent',
                param: param,
                success: function(data) {
                    $scope.linedata  = data.errmsg.data;
                    // 显示的时间段
                    var arrTime = [];
                    // 曲线数据
                    var linedata =[];

                    
                     // 曲线数据显示
                    $scope.linedata.map(function (obj) {
                      arrTime.push($filter('date')(new Date(obj.Date), 'MM-dd'));
                      linedata.push(obj.count);
                    });
                    if($scope.linedata.length>0){
                        // 曲线数据
                        if($scope.linedata.length-1 > 6 ){
                            lineOption.xAxis.max = $scope.linedata.length-1;
                            lineOption.chart.width = screenNum*lineOption.xAxis.max;
                        }else{
                            lineOption.xAxis.max = null;
                            lineOption.chart.width = null;
                        }

                        lineOption.xAxis.categories = arrTime;
                        lineOption.series[0].name = $scope.searchName;
                        lineOption.series[0].data = linedata;
                        Highcharts.chart('linedata', lineOption);
                    }
                }
            });
            //楼盘
            commonServ.post({
                url: HOST + '/broker/house-data-by-agent',
                param: param,
                success: function(data) {
                     $scope.pieData = data.errmsg.data;
                     // 曲线数据显示                   
                    if($scope.pieData.length>0){
                        pieOption.series[0].data = $scope.pieData;
                        console.log(pieOption.series[0].data);
                        Highcharts.chart('piedatas', pieOption);
                    }
                    
                }
            });
        }

        

    }

    allStatisticsController.$inject = ['$scope', 'commonServ', '$filter', 'HOST', '$location'];
})();
