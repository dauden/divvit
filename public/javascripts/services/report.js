angular.module('divvitService', [])

	// there report service
	// The function returns data of Cohort Reports
	.factory('Divvit', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api?year=2015&fmonth=7&tmonth=10');
			}
		}
	}]);