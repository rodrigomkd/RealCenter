var realCenterApp = angular.module('starter',['ngRoute','ngSanitize', 'ngCsv']);
 
realCenterApp.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {		
	
	$routeProvider
		// ---------------------------------------------------------------------------		
		.when('/home',{
			templateUrl: 'intranet/index.html',	
		// CLIENTS
		// ---------------------------------------------------------------------------		
		}).when('/list-clients',{
			templateUrl: 'intranet/templates/points.html',
			controller: 'PointsCtrl'
		}).when('/client/:clientId',{
			templateUrl: 'intranet/templates/view-client.html',
			controller: 'ClientViewCtrl'
		}).when('/list-clients-verification/:active',{
			templateUrl: 'intranet/templates/list_clients_verification.html',
			controller: 'ClientsVerificationCtrl'
		}).when('/list-client-comments/:clientId',{
			templateUrl: 'intranet/templates/list_client_comments.html',
			controller: 'ListClientCommentsCtrl'
		}).when('/view-client-comment/:commentId',{
			templateUrl: 'intranet/templates/view_client_comment.html',
			controller: 'ClientCommentCtrl'
					
		// POINTS
		// ---------------------------------------------------------------------------		
		}).when('/point',{
			templateUrl: 'intranet/templates/view-point.html',
			controller: 'PointViewCtrl'
		}).when('/list-points',{
			templateUrl: 'intranet/templates/list-points.html',
			controller: 'PointsListCtrl'
		}).when('/list-points-commerce',{
			templateUrl: 'intranet/templates/list_points_commerces.html',
			controller: 'PointsListCommercesCtrl'
		}).when('/list-points-commerce-details/:commerceid',{
			templateUrl: 'intranet/templates/list_points_commerces_details.html',
			controller: 'PointsListCommercesDetailsCtrl'
		}).when('/list-points-credential',{
			templateUrl: 'intranet/templates/list_points_credentials.html',
			controller: 'PointsListCredentialsCtrl'
		}).when('/list-points-credential-details/:clientid',{
			templateUrl: 'intranet/templates/list_points_credentials_details.html',
			controller: 'PointsListCredentialsDetailsCtrl'
		}).when('/list-points-credential-details-commerce/:ids',{
			templateUrl: 'intranet/templates/list_points_credentials_details_commerce.html',
			controller: 'PointsListCredentialsDetailsCommerceCtrl'
				
		// POINTS
		// ---------------------------------------------------------------------------
		}).when('/points-register',{
			templateUrl: 'intranet/templates/points_register.html',
			controller: 'PointsRegisterCtrl'
		
		// COMMERCES
		}).when('/list-categories',{
			templateUrl: 'intranet/templates/list_categories.html',
			controller: 'CategoriesCtrl'
		}).when('/view-category/:commercetypeid',{
			templateUrl: 'intranet/templates/view_category.html',
			controller: 'CategoryCtrl'
		}).when('/list-commerces',{
			templateUrl: 'intranet/templates/list_commerces.html',
			controller: 'CommercesCtrl'
		}).when('/view-commerce/:commerceid',{
			templateUrl: 'intranet/templates/view_commerce.html',
			controller: 'CommerceViewCtrl'
			
		// USERS
		}).when('/list-users',{
			templateUrl: 'intranet/templates/list_users.html',
			controller: 'UsersCtrl'
		}).when('/view-user/:userid',{
			templateUrl: 'intranet/templates/view_user.html',
			controller: 'UserViewCtrl'
		}).when('/register-user/:userid',{
			templateUrl: 'intranet/templates/register.html',
			controller: 'RegisterCtrl'
			
		// LOGIN
		}).when('/login',{
			templateUrl: 'intranet/templates/login.html',
			controller: 'LoginCtrl'
		}).when('/request-password',{
			templateUrl: 'intranet/templates/request_password.html',
			controller: 'RequestPasswordCtrl'
		}).when('/change-password',{
			templateUrl: 'intranet/templates/change_password.html',
			controller: 'ChangePasswordCtrl'
			
		// REPORTS
		}).when('/report-card-points',{
			templateUrl: 'intranet/templates/report_card_points.html',
			controller: 'ReportCardPointsCtrl'
		}).when('/report-card-points-acum',{
			templateUrl: 'intranet/templates/report_card_points_acum.html',
			controller: 'ReportCardPointsAcumCtrl'
		}).when('/report-client-points',{
			templateUrl: 'intranet/templates/report_client_points.html',
			controller: 'ReportClientPointsCtrl'
		}).when('/report-client-register',{
			templateUrl: 'intranet/templates/report_client_register.html',
			controller: 'ReportClientRegisterCtrl'
		
		//CONFIG
		}).when('/view-config-email',{
			templateUrl: 'intranet/templates/view_config_email.html',
			controller: 'ViewConfigEmailCtrl'
		// DEFAULT
		// ---------------------------------------------------------------------------		
		}).otherwise({
			redirectTo:'/notfound'
		});
	}
]);