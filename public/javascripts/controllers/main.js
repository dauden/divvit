angular.module('divvitController',['googlechart'])

    // inject the report service factory into our controller
    .controller('reportController', ['$scope','$http','Divvit', function($scope, $http, Divvit) {
        var data = new Date();
        var defaultReport = {
            rYear: data.getFullYear(),
            fMonth: 1,
            tMonth: data.getMonth()
        }
        $scope.reportBy = defaultReport;
        $scope.loading = true;
        this.$inject = ['$scope'];
        $scope.chartObject = {};
        

        //Methods
        $scope.hideSeries = hideSeries;

        $scope.LoadReport = getReportData;

        function getReportData(){

            var year = $scope.reportBy.rYear
            var fMonth = $scope.reportBy.fMonth;
            var tMonth = $scope.reportBy.tMonth;
            if(fMonth > tMonth){
               alert('Please select validate from date to date! \r\n To date should be greate than from date');
               return;
            }
            else{
                // when landing on the page, get report by default and show them
                // use the service to get the report
                Divvit.get(year,fMonth,tMonth)
                    .success(function(data) {
                        $scope.chartObject.data = data;
                        $scope.loading = false;
                    })
            }
        }

        // when landing on the page, get report all year have orders yet
        // use the service to get the report
        Divvit.getYear()
            .success(function(data) {
                $scope.reportBy.rYears = data;
            });

        // when landing on the page, get report all month have orders yet by year
        // use the service to get the report
        Divvit.getAllMonthYear($scope.reportBy.rYear)
            .success(function(data) {
                $scope.reportBy.fMonths = data;
                $scope.reportBy.tMonths = data;
            });
        
        
        getReportData();
        init();
        function init() {
            $scope.chartObject.type = "LineChart";
            $scope.chartObject.displayed = false;
            $scope.chartObject.options = {
                "title": "Cohort Report",
                "colors": ['#0000FF', '#009900', '#CC0000', '#DD9900','#0000FF', '#009900', '#CC0000', '#DD9900','#0000FF', '#009900', '#CC0000', '#DD9900'],
                "defaultColors": ['#0000FF', '#009900', '#CC0000', '#DD9900'],
                "isStacked": "true",
                "fill": 60,
                "displayExactValues": true,
                "vAxis": {
                    "gridlines": {
                        "count": 5
                    }
                },
                "hAxis": {
                    "title": "Month"
                }
            };
        }

        function hideSeries(selectedItem) {
            var col = selectedItem.column;
            if (selectedItem.row === null) {
                if ($scope.chartObject.view.columns[col] == col) {
                    $scope.chartObject.view.columns[col] = {
                        label: $scope.chartObject.data.cols[col].label,
                        type: $scope.chartObject.data.cols[col].type,
                        calc: function() {
                            return null;
                        }
                    };
                    $scope.chartObject.options.colors[col - 1] = '#CCCCCC';
                }
                else {
                    $scope.chartObject.view.columns[col] = col;
                    $scope.chartObject.options.colors[col - 1] = $scope.chartObject.options.defaultColors[col - 1];
                }
            }
        }
    }]);