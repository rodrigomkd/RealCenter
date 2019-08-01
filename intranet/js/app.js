var realCenterApp = angular.module('starter',['ngRoute','ngSanitize', 'ngCsv']);
 
realCenterApp.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {		
	
	$routeProvider
		// ---------------------------------------------------------------------------		
		.when('/home',{
			templateUrl: 'index.html',	
		// CLIENTS
		// ---------------------------------------------------------------------------		
		}).when('/list-clients',{
			templateUrl: 'templates/points.html',
			controller: 'PointsCtrl'
		}).when('/client/:clientId',{
			templateUrl: 'templates/view-client.html',
			controller: 'ClientViewCtrl'
		}).when('/list-clients-verification/:active',{
			templateUrl: 'templates/list_clients_verification.html',
			controller: 'ClientsVerificationCtrl'
		}).when('/list-client-comments/:clientId',{
			templateUrl: 'templates/list_client_comments.html',
			controller: 'ListClientCommentsCtrl'
		}).when('/view-client-comment/:commentId',{
			templateUrl: 'templates/view_client_comment.html',
			controller: 'ClientCommentCtrl'
					
		// POINTS
		// ---------------------------------------------------------------------------		
		}).when('/point',{
			templateUrl: 'templates/view-point.html',
			controller: 'PointViewCtrl'
		}).when('/list-points',{
			templateUrl: 'templates/list-points.html',
			controller: 'PointsListCtrl'
		}).when('/list-points-commerce',{
			templateUrl: 'templates/list_points_commerces.html',
			controller: 'PointsListCommercesCtrl'
		}).when('/list-points-commerce-details/:commerceid',{
			templateUrl: 'templates/list_points_commerces_details.html',
			controller: 'PointsListCommercesDetailsCtrl'
		}).when('/list-points-credential',{
			templateUrl: 'templates/list_points_credentials.html',
			controller: 'PointsListCredentialsCtrl'
		}).when('/list-points-credential-details/:clientid',{
			templateUrl: 'templates/list_points_credentials_details.html',
			controller: 'PointsListCredentialsDetailsCtrl'
		}).when('/list-points-credential-details/:clientid/:start_date/:end_date',{
			templateUrl: 'templates/list_points_credentials_details.html',
			controller: 'PointsListCredentialsDetailsCtrl'
		}).when('/list-points-credential-details-commerce/:ids',{
			templateUrl: 'templates/list_points_credentials_details_commerce.html',
			controller: 'PointsListCredentialsDetailsCommerceCtrl'
		}).when('/list-points-credential-details-commerce/:ids/:start_date/:end_date',{
			templateUrl: 'templates/list_points_credentials_details_commerce.html',
			controller: 'PointsListCredentialsDetailsCommerceCtrl'
				
		// POINTS
		// ---------------------------------------------------------------------------
		}).when('/points-register',{
			templateUrl: 'templates/points_register.html',
			controller: 'PointsRegisterCtrl'
		
		// COMMERCES
		}).when('/list-categories',{
			templateUrl: 'templates/list_categories.html',
			controller: 'CategoriesCtrl'
		}).when('/view-category/:commercetypeid',{
			templateUrl: 'templates/view_category.html',
			controller: 'CategoryCtrl'
		}).when('/list-commerces',{
			templateUrl: 'templates/list_commerces.html',
			controller: 'CommercesCtrl'
		}).when('/view-commerce/:commerceid',{
			templateUrl: 'templates/view_commerce.html',
			controller: 'CommerceViewCtrl'
			
		// USERS
		}).when('/list-users',{
			templateUrl: 'templates/list_users.html',
			controller: 'UsersCtrl'
		}).when('/view-user/:userid',{
			templateUrl: 'templates/view_user.html',
			controller: 'UserViewCtrl'
		}).when('/register-user/:userid',{
			templateUrl: 'templates/register.html',
			controller: 'RegisterCtrl'
		}).when('/report-client-points-details/:clientId',{
            templateUrl: 'templates/report_client_points_details.html',
            controller: 'ReportClientPointsDetailsCtrl'
			
		// LOGIN
		}).when('/login',{
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		}).when('/request-password',{
			templateUrl: 'templates/request_password.html',
			controller: 'RequestPasswordCtrl'
		}).when('/change-password',{
			templateUrl: 'templates/change_password.html',
			controller: 'ChangePasswordCtrl'
			
		// REPORTS
		}).when('/report-card-points',{
			templateUrl: 'templates/report_card_points.html',
			controller: 'ReportCardPointsCtrl'
		}).when('/report-card-points-acum',{
			templateUrl: 'templates/report_card_points_acum.html',
			controller: 'ReportCardPointsAcumCtrl'
		}).when('/report-client-points',{
			templateUrl: 'templates/report_client_points.html',
			controller: 'ReportClientPointsCtrl'
		}).when('/report-client-register',{
			templateUrl: 'templates/report_client_register.html',
			controller: 'ReportClientRegisterCtrl'
		}).when('/report-client-points-details/:clientId',{
			templateUrl: 'templates/report_client_points_details.html',
			controller: 'ReportClientPointsDetailsCtrl'
		
		//CONFIG
		}).when('/view-config-email',{
			templateUrl: 'templates/view_config_email.html',
			controller: 'ViewConfigEmailCtrl'
		// DEFAULT
		// ---------------------------------------------------------------------------		
		}).otherwise({
			redirectTo:'/notfound'
		});
	}
]);
