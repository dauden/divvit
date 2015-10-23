angular.module('divvitService', [])

	// there report service
	// The function returns data of Cohort Reports
	.factory('Divvit', ['$http',function($http) {
		return {
			get : function(year, fmonth, tmonth) {
				return $http.get('/api?year=' + year + '&fmonth=' + fmonth + '&tmonth=' + tmonth );
			},
			getYear : function(){
				return $http.get('/api/year');
			}
			,
			getAllMonthYear : function(year){
				return $http.get('/api/month?ryear=' + year);
			}
		}
	}]);
