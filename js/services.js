//angular.module('starter.services', [])

RCenterPointApp.factory('RCService', function($http) {
  var service = {};
  var url = "http://nomada.com.mx/cardpoint/js/";
	
	service.getClient = function(clientid){		
		return $http.post(url + "getClient.php", {"clientid" : clientid})
			.then( function(res) { //success callback
			return res.data;
		},function(err){ //error callback
			console.log(err)
		})
	};
	
	service.updateValidClient = function(client){
		return $http.post(url + "updateValidClient.php", {"verification_date" : 
			client.verification_date, "active" : 1, "password" : client.pwd1,
			"clientid" : client.clientid })
			.then( function(res) { //success callback
				return res.data;
		},function(err){ //error callback
			console.log(err)
		})
	};
	
	service.getClientByEmail = function(email){
		return $http.post(url + "getClientByEmail.php", {"email" : email})
			.then( function(res) { //success callback
			return res.data;
		},function(err){ //error callback
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getClientByReferenceId = function(email){
		return $http.post(url + "getClientByReferenceId.php", {"referenceid" : email})
			.then( function(res) {
			return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	//get Total POINTS
	service.getPointsByClient = function(clientid){
		return $http.post(url + "getPointsByClient.php", {"clientid" : clientid})
			.then( function(res) { //success callback
				return res.data;
		},function(err){ //error callback
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.sendEmail = function(subject, message, to){
		return $http.post(url + "sendEmail.php", {"subject" : subject, "message" : message, "to" : to})
			.then( function(res) { //success callback
				return res.data;
		},function(err){ //error callback
			alert("ERROR: " + err);
			console.log(err)
		})
	};
		
	//get historial points by Client
	service.getPointsByClientId = function(clientid){
		return $http.post(url + "getPointsByClientDetails.php", {"clientid" : clientid})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err.status);
			console.log(err)
		})
	};
	
	return service;
});
