RCenterPointApp.run(function($rootScope, $location) {
    $rootScope.location = $location;
	$rootScope.$on('$routeChangeStart', function (event) {
			if($location.path() == "/request-password"){
				return;
			}
			if($location.path().indexOf("/register") != -1){
				$rootScope.location = "/register";				
				return;
			}
            if (typeof window.sessionStorage['clientid'] == "undefined") {
                $location.path("/login");
            }
        });
});

RCenterPointApp.controller('MainCtrl', function($scope, $location) {
	$scope.logout = function(){
		window.sessionStorage.clear();
		$location.path("/login");
	};
});

RCenterPointApp.controller('HomeController', function($scope, RCService, $filter) {
	$scope.name = "";
	$scope.points = "";
	$scope.isLogin = false;
	
	$scope.items = {};
	$scope.search = "";
	$scope.pageSize = "10";
	//variables to table pagination 
	$scope.gap = 5;    
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
	
	var clientid = window.sessionStorage['clientid'];
	RCService.getPointsByClientId(clientid).then(function(result){
		$scope.items = result;
		$scope.setPageSize();
	});

	RCService.getClient(clientid).then(function(result){
		$scope.name = result.name;
	});
	
	RCService.getPointsByClient(clientid).then(function(result){
		if(result.total_points == null){
			$scope.points = 0;
		}else{
			$scope.points = result.total_points;
		}		
	});
	
	$scope.setPageSize = function () {
	   $scope.itemsPerPage = $scope.pageSize;	   
	   var decimalGap = $scope.items.length / $scope.itemsPerPage;
	   var roundGap = Math.round($scope.items.length / $scope.itemsPerPage);
	   if(roundGap < decimalGap){
		   roundGap++;
	   }
	   
	   $scope.gap = roundGap;
	   $scope.search();
	};
    // init
    $scope.sort = {       
                sortingOrder : 'id',
                reverse : false
            };
				
    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
            for(var attr in item) {
				//alert(attr);
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sort.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };
    
    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];
        
        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };
    
    $scope.range = function (size,start, end) {
        var ret = [];        
        console.log(size,start, end);
                      
        if (size < end) {
            end = size;
            start = size-$scope.gap;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }        
         console.log(ret);        
        return ret;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
});

RCenterPointApp.controller('LoginCtrl', function($scope, $http, $log, RCService, $location) {
	$scope.client = [];
	$scope.login_error = false;
	$scope.login_error_msg = "";
	$scope.isLogin = "isLogin";
	
	$scope.createLogin = function(client) {
		RCService.getClientByEmail(client.email).then(function(result){
			if(typeof result == "undefined"){
				$scope.login_error = true;
				$scope.login_error_msg = "Usuario y/o contraseña incorrecta.";
			}else{
				if(client.email == result.email && client.password == result.password){
					//add session
					//user test: rodrigo@gmail.com
					//password: 123456
					//alert(result.clientid);
					//$cookies.clientid = result.clientid;
					window.sessionStorage['clientid'] = result.clientid;
					$location.path("/home");
				}else{
					$scope.login_error = true;
					$scope.login_error_msg = "Usuario y/o contraseña incorrecta.";
				}				
			}
			
		});
	};
});

RCenterPointApp.controller('RegisterCtrl', function($scope, $http, $log, $routeParams, $location, RCService, $filter) {
	$scope.client = [];
	$scope.name = "";
	$scope.email = "";
	$scope.regiter_error = false;
	$scope.regiter_error_msg = "";
	
	RCService.getClientByReferenceId($routeParams.clientid).then(function(result){
		$scope.client = result;
		$scope.name = $scope.client.name;
		$scope.email = $scope.client.email;
		
		if($scope.client.active == 1){
			$location.path("/login");
		}
		
		if(result.name == "undefined"){
			$location.path("/notfound");
		}
	});
	
	$scope.registerClient = function(client) {	
		if(client.pwd1.length < 6){			
			$scope.register_error = true;
			$scope.register_error_msg = "La contraseña debe contener mínimo 6 caracteres.";
			return;
		}
		
		if(client.pwd1 != client.pwd2){
			$scope.register_error = true;
			$scope.register_error_msg = "Las contraseñas no coinciden.";
			return;
		}
		
		$scope.register_error = false;
		client.verification_date = $filter('date')(new Date(), 'yyyy-MM-dd');
		RCService.updateValidClient(client).then(function(result){
			alert("Se han guardado los cambios correctamente.");
			$location.path("/login");
		});
	};
});

RCenterPointApp.controller('RequestPasswordCtrl', function($scope, $http, $log, $routeParams, $location, RCService, $filter, $location, RCService) {
	$scope.requestPassword = function(client){ 
		var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	   if(! pattern.test(client.email)){
		   $scope.request_password_error = true;
		   $scope.request_password_error_msg = "Correo electrónico incorrecto.";
	   }else{
		   //check email with account
		   //send email
		   $scope.request_password_error = false;
		   RCService.getClientByEmail(client.email).then(function(result){
				if(typeof result.email == "undefined"){
					$scope.request_password_error = true;
					$scope.request_password_error_msg = "No hay una cuenta asociada a este correo electrónico.";
				}else{
					
					if(result.active == 0){				
						var password = Date.now();
						result.active = 1;
						result.pwd1 = password;
						result.verification_date = $filter('date')(new Date(), 'dd/MM/yyyy');
						result.password = password;
						RCService.updateValidClient(result).then(function(result2){ });
					}
					
					alert("Se ha enviado la contraseña a tu correo electrónico.");
					$location.path("/login");
					
					RCService.sendEmail("Recuperación de Contraseña","Hola " + result.name + ", tu contraseña para ingresar al sistema de Puntos 'Real Center' es: " 
					+ result.password, client.email).then(function(result2){						
					});		
				}
			});
	   }
	};
});

RCenterPointApp.controller('ChangePasswordCtrl', function($scope, $http, $log, $routeParams, $location, RCService, $filter, $location, RCService) {
	$scope.changePassword = function(client){
		RCService.getClient(window.sessionStorage['clientid']).then(function(result){					
			if(client.current_pwd != result.password){
				$scope.is_error = true;
				$scope.error_msg = "La contraseña actual es incorrecta.";
				return;
			}else{
				if(client.pwd1.length < 6){			
					$scope.is_error = true;
					$scope.error_msg = "La contraseña debe contener mínimo 6 caracteres.";
					return;
				}
		
				if(client.pwd1 != client.pwd2){
					$scope.is_error = true;
					$scope.error_msg = "Las contraseñas no coinciden.";
					return;
				}				
			}
			//update
			client.verification_date = result.verification_date;
			client.clientid = window.sessionStorage['clientid'];
			RCService.updateValidClient(client).then(function(result){
				alert("La contraseña ha sido cambiada correctamente.");
				$location.path("/home");
			});
		});					   
	};
});