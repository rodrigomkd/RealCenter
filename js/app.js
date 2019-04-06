var RCenterPointApp = angular.module('starter',['ngRoute']);
 
RCenterPointApp.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {	
	
	$routeProvider
		// ---------------------------------------------------------------------------		
		.when('/home',{
			templateUrl: 'templates/home.html',
			controller: 'HomeController'
		// ---------------------------------------------------------------------------		
		}).when('/login',{
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		}).when('/register/:clientid',{
			templateUrl: 'templates/register.html',
			controller: 'RegisterCtrl'
		}).when('/request-password',{
			templateUrl: 'templates/request_password.html',
			controller: 'RequestPasswordCtrl'
		}).when('/change-password',{
			templateUrl: 'templates/change_password.html',
			controller: 'ChangePasswordCtrl'
				
		// DEFAULT
		// ---------------------------------------------------------------------------		
		}).otherwise({
			redirectTo:'/notfound'
		});
	}
])