angular.module('divvitController',['googlechart'])

    // inject the report service factory into our controller
    .controller('reportController', ['$scope','$http','Divvit', function($scope, $http, Divvit) {
        $scope.reportYear = [{id: '2015', name: '2015'}];
        $scope.loading = true;
        this.$inject = ['$scope'];
        $scope.chartObject = {};
        
        //Methods
        $scope.hideSeries = hideSeries;

        // GET =====================================================================
        // when landing on the page, get report by default and show them
        // use the service to get the report
        Divvit.get()
            .success(function(data) {
                $scope.chartObject.data = data;
                $scope.loading = false;
                
            });
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