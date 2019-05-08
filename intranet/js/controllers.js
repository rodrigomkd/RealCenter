var url = "https://tarjeta.realcenter.com.mx/intranet/js/";
var url_app = "https://tarjeta.realcenter.com.mx/intranet/";
var url_users = "https://tarjeta.realcenter.com.mx/";
var limit_points = 5000;
var age_validation = 16;

function JSONToCSVConvertor(JSONData, ReportTitle, Headers) {
		//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
		var CSV = '';    
		//set Headers
		//var row="No.,No. de Credencial,Nombres,Apellido,e-mail,Telefono,Cumpleaños,FechaRegistro,Colonia,CP,Sexo,FechaVerificacion";
		CSV += Headers + '\r\n';
		//1st loop is to extract each row
		for (var i = 0; i < arrData.length; i++) {
			var row = (i+1) + ",";
        
			//2nd loop will extract each column and convert it in string comma-seprated
			for (var index in arrData[i]) {
				if(index === "pointsid"){
					continue;
				}
				if(index === "clientid"){
					continue;
				}
				if(index === "$$hashKey"){
					continue;
				}else{
					row += '"' + arrData[i][index] + '",';
				}
			}

			row.slice(0, row.length - 1);
        
			//add a line break after each row
			CSV += row + '\r\n';
		}

		if (CSV == '') {        
			alert("Invalid data");
			return;
		}   
    
		//this will remove the blank-spaces from the title and replace it with an underscore
		var fileName = ReportTitle.replace(/ /g,"_");   
		
		//Initialize file format you want csv or xls
		var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
		// Now the little tricky part.
		// you can use either>> window.open(uri);
		// but this will not work in some browsers
		// or you will not get the correct file extension    
		
		//this trick will generate a temp <a /> tag
		var link = document.createElement("a");    
		link.href = uri;
    
		//set the visibility hidden so it will not effect on your web-layout
		link.style = "visibility:hidden";
		link.download = fileName + ".csv";
		
		//this part will append the anchor tag and remove it after automatic click
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
}

realCenterApp.run(function($rootScope, $location, RCService) {
    $rootScope.location = $location;
	$rootScope.$on('$routeChangeStart', function (event) {
			$rootScope.role = RCService.getRole();

			if(typeof $rootScope.role === "undefined"){
				$rootScope.role = window.localStorage["role"];
			}else{
				window.localStorage["role"] = $rootScope.role;
			}
						
			if($location.path() == "/request-password"){
				return;
			}

			if($location.path().indexOf("/register-user") != -1){
				$rootScope.location = "/register-user";
				return;
			}
            if (typeof window.localStorage['userid'] == "undefined") {
                $location.path("/login");
            }
			//hidde url's depend of the role
			//alert(window.localStorage["role"]);
			if(window.localStorage["role"] == 'R'){
				if($location.path().indexOf("/view-category") != -1){
					$location.path("/notfound");
					return;
				}
			
				if($location.path() == "/list-categories"){
					$location.path("/notfound");
					return;
				}
				
				if($location.path().indexOf("/view-commerce") != -1){
					$location.path("/notfound");
					return;
				}
			
				if($location.path() == "/list-commerces"){
					$location.path("/notfound");
					return;
				}
				
				if($location.path().indexOf("/view-user") != -1){
					$location.path("/notfound");
					return;
				}
			
				if($location.path() == "/list-users"){
					$location.path("/notfound");
					return;
				}
				
				if($location.path() == "/report-card-points"){
					$location.path("/notfound");
					return;
				}
				
				if($location.path() == "/report-card-points-acum"){
					$location.path("/notfound");
					return;
				}
				
			}
        });
});

realCenterApp.controller('HomeController', function($scope, $location) {
	$scope.logout = function(){
		window.localStorage.clear();
		$location.path("/login");
	};
})

realCenterApp.controller('ClientsCtrl', function($scope, $http, $log) {
	$http.get(url + 'popData.php')
        .success(function(data) {
            $scope.clients = data;
			$scope.search();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
	
	$scope.config = {
		itemsPerPage: 10,
		fillLastPage: true
	}
})

realCenterApp.controller('ClientViewCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
  $("#datetimepicker1").on("dp.change", function (e) {
    $scope.birthdate = $("#birthdate").val();
  });
	
  $scope.clientid = $routeParams.clientId;
  $scope.birthdate = '';
  $scope.client = [];
  //to determine if the credential was changed or the email
  var current_credential = "";
  var current_email = "";
  if($scope.clientid > 0){	
	RCService.getClient($scope.clientid).then(function(result){
		$scope.client = result;
		$scope.birthdate = $scope.client.birthdate;
		current_credential = $scope.client.credential_number;
		current_email = $scope.client.email;
	});
  }else{	  
	  $scope.client.register_date = $filter('date')(new Date(), 'dd/MM/yyyy');
  }
  
  $scope.errorEmail = false;
  $scope.emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
   $scope.pushData = function(client) {
	   var error = false;
	   
	   if(typeof client.credential_number === "undefined"){
		   $scope.credential_number_error = true;
		   $scope.credential_number_error_msg = "El número de credencial es requerido.";
		   error = true;
	   }else{
		   $scope.credential_number_error = false;
	   } 
		   
	   if(typeof client.name === "undefined"){
		   $scope.name_error = true;
		   error = true;
	   }else{
		   $scope.name_error = false;
	   }
	   
	   if(typeof client.last_name === "undefined"){
		   $scope.last_name_error = true;
		   error = true;
	   }else{
		   $scope.last_name_error = false;
	   }
	   
	   var pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	   if(! pattern.test(client.email)){
		   $scope.email_error = true;
		   error = true;
	   }else{
		   $scope.email_error = false;
	   }
	   
	   if(typeof client.phone === "undefined"){
		   $scope.phone_error = true;
		   error = true;
	   }else{
		   $scope.phone_error = false;
	   }
	   
	   //set register date
	   $scope.client.register_date = $filter('date')(new Date(), 'yyyy-MM-dd');
	   
	   var parms = $scope.birthdate.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
		
		var date = new Date(yyyy,mm-1,dd,12,0,0,0);
		var isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   $scope.birthdate_error = true;
		   error = true;
	   }else{
		   //validate if birthday +16
		   if(validateAge($scope.client.register_date, $scope.birthdate)){
			   $scope.birthdate_error = false;
		   }else{
			   $scope.birthdate_error = true;
			   error = true;
		   }
	   }
	   
	   if(typeof client.colony === "undefined"){
		   $scope.colony_error = true;
		   error = true;
	   }else{
		   $scope.colony_error = false;
	   }
	   
	   if(typeof client.zip === "undefined"){
		   $scope.zip_error = true;
		   error = true;
	   }else{
		   $scope.zip_error = false;
	   }
	   
	   if(typeof client.gender === "undefined"){
		   $scope.gender_error = true;
		   error = true;
	   }else{
		   $scope.gender_error = false;
	   }
	   
	   if(error == true){
		   return;
	   }
	   	   
		//set date to save in the database
	   if(mm < 10){
		   mm = "0" + mm;
	   }
	   
	   if(dd < 10){
		   dd = "0" + dd;
	   }
	   client.birthdate = yyyy + "-" + mm + "-" + dd;
	   $scope.client.register_date = $filter('date')(new Date(), 'yyyy-MM-dd');
	   
	   //set uppercase
	   client.credential_number = client.credential_number.toUpperCase();
	   client.name = client.name.toUpperCase();
	   client.last_name = client.last_name.toUpperCase();
	   client.colony = client.colony.toUpperCase();

	   if($scope.clientid == 0){		   
		   RCService.getClientByCredential(client.credential_number.trim()).then(function(result_credential){				
				if(typeof result_credential.credential_number === "undefined"){				 
				   var referenceid = Date.now();
				   //save client
					$http.post(url + 'pushData.php', { 'credential_number' : client.credential_number, 
					'name': client.name, 'last_name': client.last_name, 'email': client.email, 
					'phone': client.phone, 'birthdate': client.birthdate, 'register_date': $scope.client.register_date,
					'colony': client.colony, 'zip': client.zip, 'gender': client.gender, 'active': '0', 
					'password': 'NULL', 'userid' : window.localStorage['userid'], 'referenceid' : referenceid })
					.success(function(data) {	
						alert("Se guardó el nuevo Cliente correctamente.");
						$location.path("/list-clients");
						
						//save verification points
						RCService.getClientByCredential(client.credential_number.trim()).then(function(result_client){
							RCService.saveVerificationPoints(result_client.clientid, $scope.client.register_date).then(function(result_verification){

							});
						});

						RCService.sendEmail("Verificación de Cuenta","Hola "+client.name+", para validar tu cuenta en Real Center "+
							"debes ingresar al siguiente enlace y crear una nueva contraseña: " + url_users + "#/register/" 
							+ referenceid, client.email).then(function(result3){ 																
						});							
					})
					.error(function(err) {
						alert("ERROR: Ocurrió un error al guardar el Cliente.");
						$log.error(err);
					})	
			   }else{
				   $scope.credential_number_error = true;
				   $scope.credential_number_error_msg = "No. de Credencial no disponible, favor de ingresar otra Credencial.";
				   error = true;
			   }
			});		   
	   }else{
		   	
			if(typeof $scope.client.userid === "undefined"){
				$scope.client.userid = 'NULL';
			}
			
			if(current_credential !== client.credential_number){				
				var c = [];
				c.clientid = $scope.clientid;
				c.comments_date = $filter('date')(new Date(), 'yyyy-MM-dd');
				c.description = "SISTEMA: Se le entregó una nueva credencial. Anterior: " + 
					current_credential + ". Nueva: " + client.credential_number;
			}
			
			if(current_email !== client.email){
				$scope.client.active = 0;
			}
			
			if(typeof $scope.client.referenceid === "undefined"){
				$scope.client.referenceid = new Date();
			}
				
		   $http.post(url + 'updateClient.php', { 'credential_number' : client.credential_number, 
			'name': client.name, 'last_name': client.last_name, 'email': client.email, 
			'phone': client.phone, 'birthdate': client.birthdate, 'register_date': client.register_date,
			'colony': client.colony, 'zip': client.zip, 'gender': client.gender, 'active': $scope.client.active, 
			'password': $scope.client.password, 'clientid': $scope.client.clientid })
            .success(function(data) {
				alert("Los cambios fueron guardados correctamente.");
				$location.path("/list-clients");
				
				if(current_credential !== client.credential_number){				
					RCService.saveComment(c).then(function(result){});
				}
			
				if(current_email !== client.email){					
					RCService.sendEmail("Verificación de Cuenta","Hola "+client.name+", para validar tu nuevo correo electrónico en Real Center "+
						"debes ingresar al siguiente enlace y crear de nuevo una contraseña: " + url_users + "#/register/" 
						+ $scope.client.referenceid, client.email).then(function(result3){

						});
				}
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al guardar el Cliente." + err);
                $log.error(err);
			})
	   }//else  			
	};
		
	$scope.resendEmail = function(){
		if($scope.client.active === '1'){
			alert("El Cliente ya ha activado su Cuenta.");
			return;
		}
		
		alert("Se ha enviado el e-mail al correo: " + $scope.client.email);
		RCService.sendEmail("Verificacion de Cuenta","Hola " + $scope.client.name + ", para validar tu cuenta en Real Center "+
			"debes ingresar al siguiente enlace y crear una nueva contraseña: " + url_users + "#/register/" 
			+ $scope.client.referenceid, $scope.client.email).then(function(result3){});		
	};
	
	$scope.validateEmail = function(){
		if($scope.client.active === '1'){
			alert("El Cliente ya ha validado su e-mail.");
			return;
		}
		
		//set active client
		$scope.client.active = 1;
		$scope.client.verification_date = $filter('date')(new Date(), 'yyyy-MM-dd');
		$scope.client.pwd1 = Date.now();

		RCService.updateValidClient($scope.client).then(function(result){
			let message = "Hola " + $scope.client.name + ", para ingresar al sistema de Puntos 'Real Center' debes " +
			"abrir el siguiente enlace " + url_users + "#/login. El usuario es tu e-mail proporcionado (" + $scope.client.email + ") y la contraseña es " +
			"la siguiente: " + $scope.client.pwd1;
			
			RCService.sendEmail("Alta de Cuenta", message, $scope.client.email).then(function(result3){ 
				alert("Se ha validado el e-mail del Cliente correctamente.");
			});
		});
	};
});

realCenterApp.controller('PointViewCtrl', function($scope, $routeParams, $http, $log) {
		// function to submit the form after all validation has occurred			
		$scope.submitForm = function() {

			// check to make sure the form is completely valid
			if ($scope.userForm.$valid) {
				alert('our form is amazing');
			}

		};


});

realCenterApp.controller('PointsCtrl', function($scope, $filter, $http, RCService) {
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

	$http.get(url + 'popData.php')
        .success(function(data) {
            $scope.items = data;
			//$scope.search();
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
			//alert(status);
            $log.error(data);
	})
	
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
            $scope.filteredItems = $filter('orderBy')($scope.items, $scope.sort.sortingOrder, $scope.sort.reverse);//($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
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
		//alert($scope.pagedItems.length);
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };
	
	$scope.setPageSelect = function () {
		$scope.currentPage = $scope.currentPage - 1;
    };

    // functions have been describe process the data for display
    //$scope.search();
	$scope.deleteClient = function(client){
		var question = confirm("¿Desea eliminar el Cliente seleccionado?");
		if(! question){
			return;
		}

		$http.post(url + 'deleteClient.php', { 'clientid' : client.clientid })
            .success(function(data) {			
				$http.get(url + 'popData.php').success(function(data) {
					$scope.items = data;
					$scope.setPageSize();
					alert("Se ha eliminado el Cliente correctamente.");
				}).error(function(data,status,headers,config) {
					$log.error(data);
				})
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al Eliminar el Cliente.");
                $log.error(err);
			})
	};
	
	$scope.clearFilter = function(){
		$scope.initial_date = "";
		$scope.final_date = "";
		$http.post(url + 'popData.php', {
		})
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
		})
	};
	
	$scope.exportData = function () {
		var headers = "No.,No. de Credencial,Nombre(s),Apellidos,e-mail,Telefono,Cumpleaños,FechaRegistro,Colonia,CP,Sexo,FechaVerificacion,Usuario";  
		JSONToCSVConvertor($scope.items, "Reporte_Clientes", headers);
	};
	
	$scope.filterDates = function(){
		var init_date = "";
		var fin_date = "";
		var parms = $scope.initial_date.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
		
		var date = new Date(yyyy,mm-1,dd,12,0,0,0);
		var isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Inicial. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   init_date = yyyy + "-" + mm + "-" + dd;
	   
	   parms = $scope.final_date.split(/[\.\-\/]/);
	   dd   = parseInt(parms[0],10);
	   mm   = parseInt(parms[1],10);
	   yyyy = parseInt(parms[2],10);
		
		date = new Date(yyyy,mm-1,dd,12,0,0,0);
		isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Final. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   
	   fin_date = yyyy + "-" + mm + "-" + dd;
		$http.post(url + 'getClientsDates.php', { 'initial_date' : init_date, 
			'final_date' : fin_date })
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
		})
	};
	
	$scope.clearFilter = function(){
		$scope.initial_date = "";	
		$scope.final_date = "";
		$http.post(url + 'popData.php', {})
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
		})
	};
	
	$scope.searchByColumn = function(){
		if(typeof $scope.filterBy === "undefined"){
			alert("Favor de seleccionar un valor en 'Buscar por'");
			return;
		}
		
		if(typeof $scope.filterByText === "undefined"){
			alert("Favor de ingresar el valor a Buscar");
			return;
		}

		$scope.filterByText = $scope.filterByText.toUpperCase();
		RCService.getClientsByColumn("c." + $scope.filterBy, $scope.filterByText).then(function(result){
			$scope.items = result;
			$scope.setPageSize();
		});
	};
	
	$scope.clearSearchByColumn = function(){
		$scope.filterBy = "undefined";	
		$scope.filterByText = "";
		$http.post(url + 'popData.php', {})
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
		})
	};
});

realCenterApp.$inject = ['$scope', '$filter'];

realCenterApp.directive("customSort", function() {
return {
    restrict: 'A',
    transclude: true,    
    scope: {
      order: '=',
      sort: '='
    },
    template : 
      ' <a ng-click="sort_by(order)" style="color: #555555;">'+
      '    <span ng-transclude></span>'+
      '    <i ng-class="selectedCls(order)"></i>'+
      '</a>',
    link: function(scope) {
                
    // change sorting order
    scope.sort_by = function(newSortingOrder) {       
        var sort = scope.sort;
        
        if (sort.sortingOrder == newSortingOrder){
            sort.reverse = !sort.reverse;
        }                    

        sort.sortingOrder = newSortingOrder;        
    };
    
   
    scope.selectedCls = function(column) {
        if(column == scope.sort.sortingOrder){
            return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
        }
        else{            
            return'icon-sort' 
        } 
    };      
  }// end link
}
});

realCenterApp.controller('PointsRegisterCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$("#datetimepicker1").on("dp.change", function (e) {
		$scope.buy_date = $("#buy_date").val();
	});
	
	RCService.getCommercesActives().then(function(result){
		$scope.commerces = result;
	});
	
	$scope.point = [];
	$scope.point.register_date = $filter('date')(new Date(), 'dd/MM/yyyy');
	$scope.buy_date = '';
	
	$scope.compareData = function (point){
		var error = false;
		if(typeof $scope.credential_number_scope.credential_number === "undefined"){			
			$scope.credential_number_error = true;
			$scope.credential_number_error_msg = "No se encontró registro del Número de Credencial."
			error = true;
		}else{
			if($scope.credential_number_scope.active == 1){
				point.clientid = $scope.credential_number_scope.clientid;
				$scope.credential_number_error = false;
				error = false;
			}else{
				$scope.credential_number_error = true;
				$scope.credential_number_error_msg = "Cuenta sin verificación. El Cliente debe verificar su Cuenta a través de su e-mail."
				error = true;
			}			
		}
		
		//valid buy date
		//var pattern_date = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
	   var parms = $scope.buy_date.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
		
		var date = new Date(yyyy,mm-1,dd,12,0,0,0);
		var isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   $scope.buy_date_error = true;
		   error = true;
	   }else{
		   $scope.buy_date_error = false;
		   	point.buy_date = yyyy + "-" + mm + "-" + dd;
	   }

	   if(typeof point.commerce === "undefined"){
		   $scope.commerce_error = true;
		   error = true;
	   }else{
		   $scope.commerce_error = false;
		   point.commerceid = angular.fromJson($scope.point.commerce).commerceid;
	   }
	   
	   if(typeof point.quantity === "undefined"){
		   $scope.quantity_error_msg = "El Monto es requerido.";
		   $scope.quantity_error = true;
		   error = true;
	   }else{
		   var RE = /^-{0,1}\d*\.{0,1}\d+$/;
		   if(RE.test(point.quantity)){
				$scope.quantity_error = false;
		   }else{
			    $scope.quantity_error_msg = "El Monto no es una cantidad válida.";
				$scope.quantity_error = true;
				error = true;
		   }
	   }

	   if(typeof point.ticket_number === "undefined"){
		   $scope.ticket_number_error = true;
		   $scope.ticket_number_error_msg = "El No. de Ticket es requerido.";
		   error = true;
	   }else{
		   $scope.ticket_number_error = false;		   
	   }

		if(error === false){
			RCService.getTicketNumber(point.ticket_number, point.commerceid).then(function(result){				
				$scope.savePoints(point, result.ticket_number);
			});
		}
	};
	
	$scope.savePoints = function(point, ticket_number){
		if(ticket_number == point.ticket_number){
		   $scope.ticket_number_error = true;
		   $scope.ticket_number_error_msg = "El número Ticket ya fue registrado.";
			return;
	   }
	   
		point.register_date = $filter('date')(new Date(), 'yyyy-MM-dd');
		var percent = '';
		if(typeof point.percent !== "undefined"){
			percent = (point.percent - 1) * 100;
		}
		
		var comments = '';
		if(typeof point.comments !== "undefined"){
			comments = point.comments;
		}

		//check the 5000 points
		RCService.getPointsByClientAndMonth(point.clientid, point.commerceid).then(function(result){
			if(result.total_points >= limit_points){
				alert("No se pueden registrar los Puntos. El Cliente ha llegado al límite de Puntos (" + limit_points + ") por mes y por Negocio.");
				return;
			}else if((Number(result.total_points) + Number(point.points)) > limit_points){
				point.points = limit_points - result.total_points;
			}
				//save Data
			   $http.post(url + 'savePoints.php', { 'clientid' : point.clientid, 
				'buy_date': point.buy_date, 'register_date': point.register_date, 'commerceid': point.commerceid, 
				'quantity': point.quantity, 'comments': point.comments, 'ticket_number': point.ticket_number,
				'percent': percent, 'points' : point.points })
				.success(function(data) {
					alert("Los Puntos fueron registrados correctamente.");
					$location.path("/list-points");
				})
				.error(function(err) {
					alert("ERROR: Ocurrió un error al registrar los Puntos.");
					$log.error(err);
				})			
		});
	};
	
	//tope por mes, fecha de corte
	$scope.save = function(point){
	   if(typeof point.credential_number === "undefined"){
		   $scope.credential_number_error = true;
		   $scope.credential_number_error_msg = "El número de credencial es requerido.";
	   }else{
		   //valid correct credential number
		   $scope.credential_number_scope = [];
		   RCService.getClientByCredential(point.credential_number).then(function(result){
				$scope.credential_number_scope = result;
				$scope.compareData(point);
			});
	   }  
	};
	
	$scope.setPoints = function (){
		var commerce = angular.fromJson($scope.point.commerce);
		var quantity = $scope.point.quantity;
		var limited = commerce.limited;
		
	   if(limited > 0){
		   if(Number(quantity) > Number(limited)){
			   quantity = limited;
		   }
	   }
	   	
	   var points = (quantity * commerce.percent) / 100; 
	  var promotion = $scope.point.percent;
	  if(typeof promotion === "undefined"){
		  ;
	  }else{
		  points = points * promotion;
	  }
	    
	   $scope.point.points = points;
	};
});

realCenterApp.controller('PointsListCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
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
	//
	var d = new Date();
	$scope.final_date = $filter('date')(d, 'dd/MM/yyyy');
	d.setDate(d.getDate() - 7);
	$scope.initial_date = $filter('date')(d, 'dd/MM/yyyy');
	
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

	RCService.getPointsByDates($scope.initial_date, $scope.final_date).then(function(result){
		$scope.items = result;
		$scope.setPageSize();
	});

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

	$scope.cancelPoint = function(point){
		var question = confirm("¿Desea Cancelar el Registro seleccionado?");
		if(! question){
			return;
		}

		$http.post(url + 'deletePoint.php', { 'pointid' : point.pointsid })
            .success(function(data) {
				alert("Se ha cancelado el registro correctamente.");
				$http.get(url + 'getPoints.php')
					.success(function(data) {
						$scope.items = data;
						$scope.setPageSize();
					})
					.error(function(data,status,headers,config) {
						$log.error(data);
				})
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al Eliminar el Cliente.");
                $log.error(err);
			})
	};
	
	$scope.filterDates = function(){
		var parms = $scope.initial_date.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
		
		var date = new Date(yyyy,mm-1,dd,12,0,0,0);
		var isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Inicial. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   parms = $scope.final_date.split(/[\.\-\/]/);
	   dd   = parseInt(parms[0],10);
	   mm   = parseInt(parms[1],10);
	   yyyy = parseInt(parms[2],10);
		
		date = new Date(yyyy,mm-1,dd,12,0,0,0);
		isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Final. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   
	   RCService.getPointsByDates($scope.initial_date, $scope.final_date).then(function(result){
		   $scope.items = result;
			$scope.setPageSize();
		});
	};
	
	$scope.clearFilter = function(){
		$scope.initial_date = "";
		$scope.final_date = "";
		$http.post(url + 'getPoints.php', {
		})
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
		})
	};
	
	$scope.exportData = function () {
		var headers = "No.,Negocio,Fecha Compra,Fecha Registro,No. Credencial,No. Ticket,Monto,Puntos,Nota,Promoción";
		JSONToCSVConvertor($scope.items, "Historial_Puntos", headers);
	};
});

realCenterApp.controller('PointsListCommercesCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
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

	$http.get(url + 'getPointsCommerces.php')
        .success(function(data) {
            $scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
			//alert(status);
            $log.error(data);
	})
	
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

realCenterApp.controller('PointsListCredentialsCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$scope.commerce_name = "";
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

	RCService.getPointsCredentials().then(function(result){
		$scope.items = result;
		$scope.setPageSize();
	});
	
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
	
	$scope.exportData = function () {
		var headers = "No.,No. de Credencial,Monto MXN,Total de Puntos,Cantidad de Tickets";  
		JSONToCSVConvertor($scope.items, "Reporte_Puntos_Credencial", headers);
	};
	
	$scope.filterDates = function(){
		var parms = $scope.initial_date.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
		
		var date = new Date(yyyy,mm-1,dd,12,0,0,0);
		var isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Inicial. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   
	   var initial_date = yyyy + "-" + mm + "-" + dd;
	   parms = $scope.final_date.split(/[\.\-\/]/);
	   dd   = parseInt(parms[0],10);
	   mm   = parseInt(parms[1],10);
	   yyyy = parseInt(parms[2],10);
		
		date = new Date(yyyy,mm-1,dd,12,0,0,0);
		isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Final. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   
	   var final_date = yyyy + "-" + mm + "-" + dd;
	   RCService.getPointsCredentialsDates(initial_date, final_date).then(function(result){
			$scope.items = result;
			$scope.setPageSize();
		});
	};
	
	$scope.clearFilter = function(){
		$scope.initial_date = "";
		$scope.final_date = "";
		
		RCService.getPointsCredentials().then(function(result){
			$scope.items = result;
			$scope.setPageSize();
		});
	};
});

realCenterApp.controller('PointsListCommercesDetailsCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
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

	$http.post(url + 'getPointsCommercesDetails.php', { 'commerceid' : $routeParams.commerceid })
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
	
	$http.post(url + 'getCommerce.php', { 'commerceid' : $routeParams.commerceid })
        .success(function(data) {
			$scope.commerce_name = data.commerce_name;
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
	
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

realCenterApp.controller('PointsListCredentialsDetailsCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$scope.clientid = $routeParams.clientid;
	$scope.credential_number = "";
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

	$http.post(url + 'getPointsCredentialsDetails.php', { 'clientid' : $routeParams.clientid })
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
	
	$http.post(url + 'getClient.php', { 'clientid' : $routeParams.clientid })
        .success(function(data) {
			$scope.credential_number = data.credential_number;
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
	
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

realCenterApp.controller('PointsListCredentialsDetailsCommerceCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$scope.credential_number = "";
	$scope.commerce_name = "";
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
			
	var clientid = $routeParams.ids.split("-")[0];
	var commerceid = $routeParams.ids.split("-")[1];
	$scope.clientid = clientid;
	$http.post(url + 'getPointsCredentialsDetailsCommerce.php', { 'clientid' : clientid, 'commerceid' : commerceid })
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
	
	$http.post(url + 'getClient.php', { 'clientid' : clientid })
        .success(function(data) {
			$scope.credential_number = data.credential_number;
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
	
	$http.post(url + 'getCommerce.php', { 'commerceid' : commerceid })
        .success(function(data) {
			$scope.commerce_name = data.commerce_name;
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
	
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

realCenterApp.controller('ClientsVerificationCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
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
	//
	var d = new Date();
	$scope.final_date = $filter('date')(d, 'dd/MM/yyyy');
	d.setDate(d.getDate() - 7);
	$scope.initial_date = $filter('date')(d, 'dd/MM/yyyy');	
	
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
			
	$http.post(url + 'getClientsByVerification.php', { 'active' : $routeParams.active })
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
		
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
	
	$scope.exportData = function () {
		var headers = "No.,No. de Credencial,Nombre(s),Apellido,e-mail,Telefono,Cumpleaños,FechaRegistro,Colonia,CP,Sexo,FechaVerificacion,Usuario";  
		JSONToCSVConvertor($scope.items, "Reporte_Verificacion_Emails", headers);
	};
	
	$scope.filterDates = function(){
		var parms = $scope.initial_date.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
		
		var date = new Date(yyyy,mm-1,dd,12,0,0,0);
		var isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Inicial. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   var initial_date = yyyy + "-" + mm + "-" + dd;
	   parms = $scope.final_date.split(/[\.\-\/]/);
	   dd   = parseInt(parms[0],10);
	   mm   = parseInt(parms[1],10);
	   yyyy = parseInt(parms[2],10);
		
		date = new Date(yyyy,mm-1,dd,12,0,0,0);
		isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Final. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   
	   var final_date = yyyy + "-" + mm + "-" + dd;
		$http.post(url + 'getClientsByVerificationByDates.php', { 'initial_date' : initial_date, 
			'final_date' : final_date })
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
		})
	};
	
	$scope.clearFilter = function(){
		$scope.initial_date = "";
		$scope.final_date = "";
		$http.post(url + 'getClientsByVerification.php', { 'active' : 1 
		})
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
		})
	};
});

realCenterApp.controller('CategoriesCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
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
			
	$http.post(url + 'getCategories.php')
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
		
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
	
	$scope.deleteCategory = function(item){
		var question = confirm("¿Desea eliminar la Categoría seleccionada?");
		if(! question){
			return;
		}

		$http.post(url + 'deleteCategory.php', { 'categoryid' : item.commercetypeid })
            .success(function(data) {
				alert("Se ha eliminado la Categoría correctamente.");
				$http.get(url + 'getCategories.php')
					.success(function(data) {						
						$scope.items = data;
						$scope.setPageSize();
					})
					.error(function(data,status,headers,config) {
						$log.error(data);
				})
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al Eliminar la Categoría.");
                $log.error(err);
			})
	};
});

realCenterApp.controller('CategoryCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {	
  var categoryid = $routeParams.commercetypeid;
  $scope.category = [];
  if(categoryid > 0){	
	RCService.getCategory(categoryid).then(function(result){
		$scope.category = result;
	});
  }
  	
   $scope.save = function(category) {
	   var error = false;
	   
	   if(typeof category.description === "undefined"){
		   $scope.category_error = true;
		   error = true;
	   }else{
		   $scope.category_error = false;
	   } 
	
	   if(typeof category.percent === "undefined"){
		   $scope.percent_error = true;
		   $scope.percent_error_msg = "El Porcentaje es requerido.";
		   error = true;
	   }else{
		   var isNumber = /^-?\d+\.?\d*$/
		   if(! isNumber.test(category.percent)){
			   $scope.percent_error = true;
			   $scope.percent_error_msg = "El Porcentaje no es un número válido.";
			   error = true;
		   }else{
			   $scope.percent_error = false;   
		   }		   
	   }
	   
	   if(typeof category.limited === "undefined" || category.limited === ""){
		   ;
	   }else{
		   var isNumber = /^-?\d+\.?\d*$/
		   if(!isNumber.test(category.limited)){
			   $scope.limited_error = true;
			   $scope.limited_error_msg = "El Límite de puntos no es un número válido.";
			   error = true;
		   }else{
			   $scope.percent_error = false;   
		   }		   
	   }
	    
	   if(error == true){
		   return;
	   }
	   	   
	   if(categoryid == 0){
		   $http.post(url + 'saveCategory.php', { 'description' : category.description, 
			'limited': category.limited, 'percent': category.percent, 'points': 'NULL'
			})
            .success(function(data) {
				alert("Se guardó la nueva Categoría correctamente.");
				$location.path("/list-categories");
        })
            .error(function(err) {
				alert("ERROR: Ocurrió un error al guardar la Categoría.");
                $log.error(err);
        })
	   }else{
		   $http.post(url + 'updateCategory.php', { 'description' : category.description, 
			'limited': category.limited, 'percent': category.percent, 
			'commercetypeid': categoryid })
            .success(function(data) {
				alert("Los cambios fueron guardados correctamente.");
				$location.path("/list-categories");
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al intentar modificar la Categoría.");
                $log.error(err);
			})
	   }   			
	};
	
});

//LOCAL
realCenterApp.controller('CommercesCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
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
			
	$http.get(url + 'getCommerces.php')
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
		
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
	
	$scope.deleteCommerce = function(item){
		var question = confirm("¿Desea eliminar la Categoría seleccionada?");
		if(! question){
			return;
		}

		$http.post(url + 'deleteCommerce.php', { 'commerceid' : item.commerceid })
            .success(function(data) {			
				$http.get(url + 'getCommerces.php')
					.success(function(data) {						
						$scope.items = data;
						$scope.setPageSize();
						alert("Se ha eliminado el Local correctamente.");
					})
					.error(function(data,status,headers,config) {
						$log.error(data);
				})
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al Eliminar el Local.");
                $log.error(err);
			})
	};
});

realCenterApp.controller('CommerceViewCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {	
  var commerceid = $routeParams.commerceid;
  $scope.c = [];
  $scope.categories = [];
  $scope.isActive = false;
  
  RCService.getCategories().then(function(result){
		$scope.categories = result;
	});
	
  if(commerceid > 0){	
	RCService.getCommerce(commerceid).then(function(result){		
		$scope.c = result;
		if(result.active == '1'){
			$scope.isActive = true;
		}else{
			$scope.isActive = false;
		}	 
	});
  }

   $scope.save = function(c) {
	   var error = false;
	
	   if(typeof c.category === "undefined" || c.category == ""){		   
		   if(commerceid > 0){
				c.categoryid = $scope.c.commercetypeid;
		   }else{
			   $scope.category_error = true;
			error = true;
		   }
	   }else{
		   $scope.category_error = false;
		   c.categoryid = angular.fromJson(c.category).commercetypeid;
	   }
	   
	   if(typeof c.commerce_name === "undefined"){
		   $scope.commerce_name_error = true;
		   error = true;
	   }else{
		   $scope.commerce_name_error = false;
	   } 
	
	   if(typeof c.commerce_number === "undefined"){
		   $scope.commerce_number_error = true;
		   error = true;
	   }else{
		   $scope.commerce_number_error = false;
	   }
	     
	   if(error == true){
		   return;
	   }
	   	  
		if($scope.isActive == true){
			c.active = true;
		}else{
			c.active = false;
		}
		
	   if(commerceid == 0){
		   $http.post(url + 'saveCommerce.php', { 'commercetypeid' : c.categoryid, 
			'commerce_name': c.commerce_name, 'commerce_number': c.commerce_number, 
			'active': c.active
			})
            .success(function(data) {
				alert("Se guardó el nuevo Local correctamente.");
				$location.path("/list-commerces");
				$scope.apply();
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al guardar el Local.");
                $log.error(err);
        })
	   }else{
		   $http.post(url + 'updateCommerce.php', { 'commercetypeid' : c.categoryid, 
			'commerce_name': c.commerce_name, 'commerce_number': c.commerce_number, 
			'commerceid' : commerceid, 'active': c.active
			})
            .success(function(data) {
				alert("Los cambios fueron guardados correctamente.");
				$location.path("/list-commerces");
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al intentar modificar la Categoría.");
                $log.error(err);
			})
	   }   			
	};
});

//USERS
realCenterApp.controller('UsersCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
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
			
	$http.post(url + 'getUsers.php')
        .success(function(data) {
			$scope.items = data;
			$scope.setPageSize();
        })
        .error(function(data,status,headers,config) {
            $log.error(data);
	})
		
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
	
	$scope.deleteUser = function(item){
		var question = confirm("¿Desea eliminar el Usuario seleccionada?");
		if(! question){
			return;
		}

		$http.post(url + 'deleteUser.php', { 'userid' : item.userid })
            .success(function(data) {			
				$http.get(url + 'getUsers.php')
					.success(function(data) {						
						$scope.items = data;
						$scope.setPageSize();
						alert("Se ha eliminado el Usuario correctamente.");
					})
					.error(function(data,status,headers,config) {
						$log.error(data);
				})
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al Eliminar el Usuario.");
                $log.error(err);
			})
	};
});

realCenterApp.controller('UserViewCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {	
  var userid = $routeParams.userid;
  $scope.c = [];
  $scope.users = [];
  $scope.isActive = false;
  
  $http.post(url + 'getUsers.php')
        .success(function(data) {
			$scope.users = data;
  });
      
	
  if(userid > 0){	
	RCService.getUser(userid).then(function(result){		
		$scope.c = result;
		$scope.isUpdate = true;
		
		if(result.active == '1'){
			$scope.isActive = true;
		}else{
			$scope.isActive = false;
		}
	});
  }

   $scope.save = function(c) {
	   var error = false;	
		var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	   
	   if(! pattern.test(c.user_name)){
		   $scope.user_name_error = true;
		   $scope.user_name_error_msg = "El E-mail es inválido.";
		   error = true;
	   }else{
		   $scope.user_name_error = false;
	   } 
	   
	   if(typeof c.name === "undefined"){
		   $scope.name_error = true;
		   error = true;
	   }else{
		   $scope.name_error = false;
	   } 
	
	   if(typeof c.role === "undefined"){
		   $scope.rol_error = true;
		   error = true;
	   }else{
		   $scope.rol_error = false;
	   }
	     
		 if(c.active == '1'){
			$scope.isActive = true;
		}else{
			$scope.isActive = false;
		}
		
		if(userid == 0){
			angular.forEach($scope.users,function(value,index){
				if(value.user_name == c.user_name){
					$scope.user_name_error_msg = "Ya se encuentra registrado otro usuario con el mismo e-mail.";
					error = true;
					$scope.user_name_error = true;
				}
			})
		} 	
			
	   if(error == true){
		   return;
	   }
	   	 
		if($scope.isActive == true){
			c.active = true;
		}else{
			c.active = false;
		}
		
	   if(userid == 0){
		   $http.post(url + 'saveUser.php', { 'user_name' : c.user_name, 
		   'role': c.role.substr(0,1), 'active': 0, 'name' : c.name 
			})
			.success(function(data) {
				RCService.getUserMax().then(function(result2){										
							RCService.sendEmail("Generación de Usuario Real Center","Hola "+c.name+", para validar tu usuario en el sistema RCardPoints "+
								"es necesario que ingreses al siguiente enlace para dar de alta tu contraseña: " + url_app + "#/register-user/" +  
								+ result2.userid, c.user_name).then(function(result3){					
								alert("Se ha generado el nuevo Usuario correctamente.");
								$location.path("/list-users");
							});				
						});
				});						
	   }else{
		   $http.post(url + 'updateUser.php', { 'user_name' : c.user_name, 
			'password' : c.password, 'role': c.role.substr(0,1), 'active': c.active, 'name' : c.name,
			'userid' : userid
			})
            .success(function(data) {
				alert("Los cambios fueron guardados correctamente.");
				$location.path("/list-users");
			})
            .error(function(err) {
				alert("ERROR: Ocurrió un error al intentar modificar la Categoría.");
                $log.error(err);
			})
	   }
	};
});

realCenterApp.controller('RegisterCtrl', function($scope, $http, $log, $routeParams, $location, RCService, $filter, $rootScope) {
	$scope.c = [];
	$scope.name = "";
	$scope.email = "";
	$scope.regiter_error = false;
	$scope.regiter_error_msg = "";
	
	RCService.getUser($routeParams.userid).then(function(result){
		$scope.c = result;
		$scope.name = $scope.c.name;
		$scope.email = $scope.c.user_name;
		if($scope.c.active == 1){
			$location.path("/login");
		}
	});
	
	$scope.save = function(c) {
		if(c.pwd1.length < 6){			
			$scope.register_error = true;
			$scope.register_error_msg = "La contraseña debe contener mínimo 6 caracteres.";
			return;
		}
		
		if(c.pwd1 != c.pwd2){
			$scope.register_error = true;
			$scope.register_error_msg = "Las contraseñas no coinciden.";
			return;
		}
		
		$http.post(url + 'updateUser.php', { 'user_name' : $scope.c.user_name, 
			'password' : c.pwd1, 'role': $scope.c.role, 'active': 1, 'name' : $scope.c.name,
			'userid' : $scope.c.userid
			})
            .success(function(data) {
				alert("Los cambios fueron guardados correctamente.");
				$location.path("/login");
			})
	};
});

realCenterApp.controller('LoginCtrl', function($scope, $http, $log, RCService, $location, $rootScope) {
	$scope.user = [];
	$scope.login_error = false;
	$scope.login_error_msg = "";
	$scope.isLogin = "isLogin";
	
	$scope.createLogin = function(client) {
		RCService.getUserByEmail(client.email).then(function(result){
			if(typeof result == "undefined"){
				$scope.login_error = true;
				$scope.login_error_msg = "Usuario y/o contraseña incorrecta.";
			}else{
				if(client.email == result.user_name && client.password == result.password 
					&& result.active == 1){
					window.localStorage['userid'] = result.userid;
					window.localStorage['role'] = result.role;
					$rootScope.role = result.role;
					RCService.setRole(result.role);
					$rootScope.location = "/list-clients";
					$location.path("/list-clients");			
				}else{
					$scope.login_error = true;
					$scope.login_error_msg = "Usuario y/o contraseña incorrecta.";
				}				
			}			
		});
	};
});

realCenterApp.controller('RequestPasswordCtrl', function($scope, $http, $log, $routeParams, $location, RCService, $filter, $location, RCService) {
	$scope.requestPassword = function(client){ 
		var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	   if(! pattern.test(client.email)){
		   $scope.request_password_error = true;
		   $scope.request_password_error_msg = "Correo electrónico incorrecto.";
	   }else{
		   //check email with account
		   //send email
		   $scope.request_password_error = false;
		   RCService.getUserByEmail(client.email).then(function(result){
				if(typeof result.user_name == "undefined"){
					$scope.request_password_error = true;
					$scope.request_password_error_msg = "No hay una cuenta asociada a este correo electrónico.";
				}else{
				RCService.sendEmail("Recuperar Contraseña","Hola "+result.name+", tu contraseña para ingresar al sistema <a href='"+url+"'+> es: " 
						+ result.password, client.email).then(function(result2){					
						alert("Se ha enviado un correo electrónico con la contraseña.");
						$location.path("/login");
					});				
				}
			});
	   }
	};
});

realCenterApp.controller('ChangePasswordCtrl', function($scope, $http, $log, $routeParams, $location, RCService, $filter, $location, RCService) {
	$scope.changePassword = function(client){
		RCService.getUser(window.localStorage['userid']).then(function(result){					
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

			$http.post(url + 'updateUser.php', { 'user_name' : result.user_name, 
				'password' : client.pwd1, 'role': result.role, 'active': result.active, 'name' : result.name,
				'userid' : window.localStorage['userid']
			})
            .success(function(data) {
				alert("Los cambios fueron guardados correctamente.");
				$location.path("/list-users");
			})
		});					   
	};
});

//REPORTS
realCenterApp.controller('ReportCardPointsCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$scope.items = [];//{};
	$scope.search = "";
	$scope.pageSize = "10";
	//variables to table pagination 
	$scope.gap = 5;    
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
	
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
			
	$scope.total_cards = [];
	$scope.total_verify = [];
	RCService.getCardPointsByWeek().then(function(result){
		$scope.total_cards = result;
		angular.forEach(result, function(value, key) {			
			var item = {};
			item.week = value.week_s;
			item.total_cards = value.cards;
			item.total_points = value.registers;
			item.percent = ((value.registers * 100)/value.cards);
			$scope.items.push(item);			
		});
		$scope.setPageSize();
	});
	
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
	
	$scope.exportData = function () {
		var headers = "No.,Semana,Tarjetas Entregadas,Registran Puntos,Porcentaje";  
		JSONToCSVConvertor($scope.items, "Reporte_TEntregadas_RegistranPuntos", headers);
	};
	
	$scope.filterDates = function(){
		var parms = $scope.initial_date.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
		
		var date = new Date(yyyy,mm-1,dd,12,0,0,0);
		var isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Inicial. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   parms = $scope.final_date.split(/[\.\-\/]/);
	   dd   = parseInt(parms[0],10);
	   mm   = parseInt(parms[1],10);
	   yyyy = parseInt(parms[2],10);
		
		date = new Date(yyyy,mm-1,dd,12,0,0,0);
		isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Final. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   
	   RCService.getCardPointsByWeekDates($scope.initial_date, $scope.final_date).then(function(result){
			$scope.total_cards = result;
			$scope.items = [];
			angular.forEach(result, function(value, key) {			
				var item = {};
				item.week = value.week_s;
				item.total_cards = value.cards;
				item.total_points = value.registers;
				item.percent = ((value.registers * 100)/value.cards);
				$scope.items.push(item);			
			});
			$scope.setPageSize();
		});
	};
	
	$scope.clearFilter = function(){
		$scope.initial_date = "";
		$scope.final_date = "";
		
		RCService.getCardPointsByWeek().then(function(result){
			$scope.items = [];
			$scope.total_cards = result;
			angular.forEach(result, function(value, key) {			
				var item = {};
				item.week = value.week_s;
				item.total_cards = value.cards;
				item.total_points = value.registers;
				item.percent = ((value.registers * 100)/value.cards);
				$scope.items.push(item);			
			});
		$scope.setPageSize();
		});
	};
});

realCenterApp.controller('ReportCardPointsAcumCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$scope.items = [];//{};
	$scope.search = "";
	$scope.pageSize = "10";
	//variables to table pagination 
	$scope.gap = 5;    
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
	
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
			
	$scope.total_cards = [];
	$scope.total_verify = [];
	RCService.getCardPointsByWeek().then(function(result){
		$scope.total_cards = result;
		var acumCards = 0;
		var acumPoints = 0;
		var pointsBefore = 0;
		var firtsValue = true;
		angular.forEach(result, function(value, key) {			
			var item = {};
			item.week = value.week_s;
			pointsBefore = parseFloat(acumPoints);
			acumCards += parseFloat(value.cards);
			acumPoints += parseFloat(value.registers);
			item.total_cards = acumCards;
			item.total_points = acumPoints;

			if(firtsValue == true){
				item.percent = "NA";
				firtsValue = false;
			}else{
				item.percent = ((acumPoints - pointsBefore)/pointsBefore)*100;
			}
			
			$scope.items.push(item);			
		});		
		$scope.setPageSize();
	});
	
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
	
	$scope.exportData = function () {
		var headers = "No.,Semana,Tarjetas Entregadas,Registran Puntos,Porcentaje";  
		JSONToCSVConvertor($scope.items, "Reporte_TEntregadas_RegistranPuntosAcum", headers);
	};
	
	$scope.filterDates = function(){
		var parms = $scope.initial_date.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
		
		var date = new Date(yyyy,mm-1,dd,12,0,0,0);
		var isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Inicial. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   parms = $scope.final_date.split(/[\.\-\/]/);
	   dd   = parseInt(parms[0],10);
	   mm   = parseInt(parms[1],10);
	   yyyy = parseInt(parms[2],10);
		
		date = new Date(yyyy,mm-1,dd,12,0,0,0);
		isDate = false;
		if(mm === parseFloat(date.getMonth() + 1) && dd === date.getDate() && 
			yyyy === date.getFullYear()){
				isDate = true;
		}

	   if(isDate === false){
		   alert("Formato inválido para Fecha Final. El formato debe ser dd/MM/yyyy");
			return;
	   }
	   
	   RCService.getCardPointsByWeekDates($scope.initial_date, $scope.final_date).then(function(result){
			$scope.total_cards = result;
			$scope.items = [];
			angular.forEach(result, function(value, key) {			
				var item = {};
				item.week = value.week_s;
				item.total_cards = value.cards;
				item.total_points = value.registers;
				item.percent = ((value.registers * 100)/value.cards);
				$scope.items.push(item);			
			});
			$scope.setPageSize();
		});
	};
	
	$scope.clearFilter = function(){
		$scope.initial_date = "";
		$scope.final_date = "";
		
		RCService.getCardPointsByWeek().then(function(result){
			$scope.items = [];
			$scope.total_cards = result;
			angular.forEach(result, function(value, key) {			
				var item = {};
				item.week = value.week_s;
				item.total_cards = value.cards;
				item.total_points = value.registers;
				item.percent = ((value.registers * 100)/value.cards);
				$scope.items.push(item);			
			});
		$scope.setPageSize();
		});
	};
});

realCenterApp.controller('ReportClientPointsCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$scope.items = {};//[];//{};
	$scope.search = "";
	$scope.pageSize = "10";
	//variables to table pagination 
	$scope.gap = 5;    
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
	
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
			
	RCService.getClientsByPoints().then(function(result){
		$scope.items = result;	
		$scope.setPageSize();
	});
	
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
	
	$scope.exportData = function () {
		var headers = "No.,Semana,Tarjetas Entregadas,Registran Puntos,Porcentaje";  
		JSONToCSVConvertor($scope.items, "Reporte_TEntregadas_RegistranPuntos", headers);
	};
	
	$scope.filterPoints = function(){
		var initial_points = parseInt($scope.initial_points);
		var final_points = parseInt($scope.final_points);
		if(isNaN(initial_points)){
			alert("Número Inválido para Puntos Iniciales, favor de Ingresar un Entero");
			return;
		}
		
		if(isNaN(final_points)){
			alert("Número Inválido para Puntos Finales, favor de Ingresar un Entero");
			return;
		}
		
	   RCService.getClientsByPointsRange(initial_points, final_points).then(function(result){
			$scope.items = result;
			$scope.setPageSize();
		});
	};
	
	$scope.clearPoints = function(){
		$scope.initial_points = "";
		$scope.final_points = "";
		
		RCService.getClientsByPoints().then(function(result){
			$scope.items = result;	
			$scope.setPageSize();
		});
	};
	
	$scope.exportData = function () {
		var headers = "No.,No. de Credencial,Nombre,e-mail,Celular,Fecha Nacimiento,Fecha Registro,Colonia,Codigo Postal,Sexo,Monto,Puntos";  
		JSONToCSVConvertor($scope.items, "Reporte_Puntos_Clientes", headers);
	};
	
	$scope.searchByColumn = function(){
		if(typeof $scope.filterBy === "undefined"){
			alert("Favor de seleccionar un valor en 'Buscar por'");
			return;
		}
		
		if(typeof $scope.filterByText === "undefined"){
			alert("Favor de ingresar el valor a Buscar");
			return;
		}

		$scope.filterByText = $scope.filterByText.toUpperCase();
		RCService.getPointsByColumn("c." + $scope.filterBy, $scope.filterByText).then(function(result){
			$scope.items = result;
			$scope.setPageSize();
		});
	};
	
	$scope.clearSearchByColumn = function(){
		$scope.filterBy = "undefined";	
		$scope.filterByText = "";
		RCService.getClientsByPoints().then(function(result){
			$scope.items = result;	
			$scope.setPageSize();
		});
	};
});

realCenterApp.controller('ReportClientPointsDetailsCtrl', function($scope, RCService, $filter, $routeParams) {
	$scope.name = "";
	$scope.points = "";
	$scope.isLogin = false;
	
	$scope.items = {};
	$scope.noValidPoints = {};
	$scope.search = "";
	$scope.pageSize = "10";
	//variables to table pagination 
	$scope.gap = 5;    
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
	
	RCService.getPointsByClientId($routeParams.clientId).then(function(result){
		$scope.items = result;
		$scope.setPageSize();
	});

	RCService.getClient($routeParams.clientId).then(function(result){
		$scope.name = result.name;
	});
	
	RCService.getPointsByClient($routeParams.clientId).then(function(result){
		if(result.total_points == null){
			$scope.points = 0;
		}else{
			$scope.points = result.total_points;
		}		
	});

	RCService.getVerificationPointsById($routeParams.clientId).then(function(result){
		if(result[0] == null){
			$scope.noValidPoints = {};
		}else{
			$scope.noValidPoints = result;
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

realCenterApp.controller('ReportClientRegisterCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$scope.items = {};//[];//{};
	$scope.search = "";
	$scope.pageSize = "10";
	//variables to table pagination 
	$scope.gap = 5;    
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
	
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
			
	RCService.getClientsByPoints().then(function(result){
		$scope.items = result;	
		$scope.setPageSize();
	});
	
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
	
	$scope.exportData = function () {
		var headers = "No.,Semana,Tarjetas Entregadas,Registran Puntos,Porcentaje";  
		JSONToCSVConvertor($scope.items, "Reporte_TEntregadas_RegistranPuntos", headers);
	};
	
	$scope.filterPoints = function(){
		var initial_points = parseInt($scope.initial_points);
		var final_points = parseInt($scope.final_points);
		if(isNaN(initial_points)){
			alert("Número Inválido para Puntos Iniciales, favor de Ingresar un Entero");
			return;
		}
		
		if(isNaN(final_points)){
			alert("Número Inválido para Puntos Finales, favor de Ingresar un Entero");
			return;
		}
		
	   RCService.getClientsByPointsRange(initial_points, final_points).then(function(result){
			$scope.items = result;
			$scope.setPageSize();
		});
	};
	
	$scope.clearPoints = function(){
		$scope.initial_points = "";
		$scope.final_points = "";
		
		RCService.getClientsByPoints().then(function(result){
			$scope.items = result;	
			$scope.setPageSize();
		});
	};
	
	$scope.exportData = function () {
		var headers = "No.,No. de Credencial,Nombre,e-mail,Celular,Fecha Nacimiento,Fecha Registro,Colonia,Codigo Postal,Sexo,Monto,Puntos";  
		JSONToCSVConvertor($scope.items, "Reporte_Puntos_Clientes", headers);
	};
});

realCenterApp.controller('ListClientCommentsCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
	$scope.items = {};//[];//{};
	$scope.search = "";
	$scope.pageSize = "10";
	//variables to table pagination 
	$scope.gap = 5;    
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
	$scope.clientId = $routeParams.clientId;
	
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
			
	RCService.getCommentsByClient($scope.clientId).then(function(result){
		$scope.items = result;	
		$scope.setPageSize();
	});
	
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
	
	$scope.exportData = function () {
		var headers = "No.,Semana,Tarjetas Entregadas,Registran Puntos,Porcentaje";  
		JSONToCSVConvertor($scope.items, "Reporte_TEntregadas_RegistranPuntos", headers);
	};
	
	$scope.filterPoints = function(){
		var initial_points = parseInt($scope.initial_points);
		var final_points = parseInt($scope.final_points);
		if(isNaN(initial_points)){
			alert("Número Inválido para Puntos Iniciales, favor de Ingresar un Entero");
			return;
		}
		
		if(isNaN(final_points)){
			alert("Número Inválido para Puntos Finales, favor de Ingresar un Entero");
			return;
		}
		
	   RCService.getClientsByPointsRange(initial_points, final_points).then(function(result){
			$scope.items = result;
			$scope.setPageSize();
		});
	};
	
	$scope.clearPoints = function(){
		$scope.initial_points = "";
		$scope.final_points = "";
		
		RCService.getClientsByPoints().then(function(result){
			$scope.items = result;	
			$scope.setPageSize();
		});
	};
	
	$scope.exportData = function () {
		var headers = "No.,No. de Credencial,Nombre,e-mail,Celular,Fecha Nacimiento,Fecha Registro,Colonia,Codigo Postal,Sexo,Monto,Puntos";  
		JSONToCSVConvertor($scope.items, "Reporte_Puntos_Clientes", headers);
	};
	
	$scope.deleteItem = function(item){
		var question = confirm("¿Desea eliminar el Comentario seleccionado?");
		if(! question){
			return;
		}

		RCService.deleteComment(item.commentsid).then(function(result){
			RCService.getCommentsByClient($scope.clientId).then(function(result){
				$scope.items = result;	
				$scope.setPageSize();
			});
		});	
	};
});

realCenterApp.controller('ClientCommentCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {
  $scope.c = [];
  $scope.c.comments_date = $filter('date')(new Date(), 'dd/MM/yyyy');
  var clientid = $routeParams.commentId.split("-")[0];
  var commentid = $routeParams.commentId.split("-")[1];
	
  if(commentid > 0){	
	RCService.getComment(commentid).then(function(result){
		$scope.c = result;
//date = $scope.c.comments_date;
	});
  }

   $scope.save = function(c) {
	   var error = false;
	
	   if(typeof c.description === "undefined" || c.category == ""){
			$scope.category_error = true;
			error = true;
	   }else{
		   $scope.category_error = false;
	   }
	     
	   if(error == true){
		   return;
	   }
	   	   
	   if(commentid == 0){
		   c.comments_date = $filter('date')(new Date(), 'yyyy-MM-dd');
		   c.clientid = clientid;
		   RCService.saveComment(c).then(function(result){
				alert("Los cambios fueron guardados correctamente.");
				$location.path("/list-client-comments/" + clientid);
			});
	   }else{
		   c.clientid = clientid;
		   c.commentsid = commentid;
		   RCService.updateComment(c).then(function(result){
				alert("Los cambios fueron guardados correctamente.");
				$location.path("/list-client-comments/" + clientid);
			});
	   }   			
	};
	
});

realCenterApp.controller('ViewConfigEmailCtrl', function($scope, $http, $log, $routeParams, $filter, $location, RCService) {	
  $scope.c = [];
  RCService.getConfigEmail().then(function(result){
		$scope.c = result;
  });

   $scope.save = function(c) {
	   var error = false;
		var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
	   if(! pattern.test(c.email)){
		   $scope.email_error = true;
		   error = true;
	   }else{
		   $scope.email_error = false;
	   }
	   
	   if(typeof c.password === "undefined" || c.password == ""){
			$scope.email_password = true;
			error = true;
	   }else{
		   $scope.email_password = false;
	   }
	     
	   if(error == true){
		   return;
	   }
	   
	   RCService.updateConfigEmail(c).then(function(result){
			alert("Los cambios fueron guardados correctamente.");			
		});
	};
	
	$scope.testEmail = function (email){
		alert("Se ha enviado el correo electrónico. Favor de verificar la Bandeja de Entrada.");
		RCService.sendEmail("E-mail de prueba","Este es un correo de prueba mediante la aplicacion " +
			"de CardPoint RealCenter", email).then(function(result3){			
		});		
	}
});

function validateAge(current_date, birthday){
	var current_array = current_date.split("-");
	var current_yyyy = current_array[0];
    var current_mm = current_array[1]; 
    var current_dd = current_array[2]; 
    
    var birth_array = birthday.split("/");
    var birth_yyyy = birth_array[2];
    var birth_mm = birth_array[1];
    var birth_dd = birth_array[0];
    
    let diff_yyyy = (current_yyyy - birth_yyyy);
    if(diff_yyyy > age_validation){
    	return true;
    }else if(diff_yyyy == age_validation){
    	if(current_mm > birth_mm){
    		return true;
    	}else if(current_mm == birth_mm){
        	return (current_dd >= birth_dd);
        }else{
        	return false;
        }
    }else{
    	return false;
    }
    
    return true;
}