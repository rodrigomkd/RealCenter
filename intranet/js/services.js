realCenterApp.factory('RCService', function($http) {
  var service = {};
  var url = "http://tarjeta.realcenter.com.mx/intranet/js/";
	var role = "";
	
	function getDate(date){
		var parms = date.split(/[\.\-\/]/);
	   var dd   = parseInt(parms[0],10);
	   var mm   = parseInt(parms[1],10);
	   var yyyy = parseInt(parms[2],10);
	   
	   return yyyy + "-" + mm + "-" + dd;
	}
	
	service.setRole = function(role){
		this.role = role;
	};
	service.getRole = function(){
		return this.role;
	};
	
	service.getClient = function(clientid){		
		return $http.post(url + "getClient.php", {"clientid" : clientid})
			.then( function(res) {
			return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	service.getClientsByDates = function(initial_date, final_date){
		return $http.post(url + "getClientsDates.php", {"initial_date" : initial_date,
			"final_date" : final_date })
			.then( function(res) {
			return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	service.getCommerces = function(clientid){
		return $http.get(url + "getCommerces.php", {})
			.then( function(res) {
			return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	service.getCommercesActives = function(){
		return $http.get(url + "getCommercesActives.php", {})
			.then( function(res) {
			return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	service.getClientByCredential = function(credential_number){
		return $http.post(url + "getClientByCredential.php", {"credential_number" : credential_number})
			.then( function(res) {
			return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getTicketNumber = function(ticket_number, commerceid){
		return $http.post(url + "getTicketNumber.php", {"ticket_number" : ticket_number, "commerceid" : commerceid})
			.then( function(res) {
			return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getCategory = function(categoryid){
		return $http.post(url + "getCategory.php", {"categoryid" : categoryid})
			.then( function(res) {
			return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getCategories = function(){
		return $http.post(url + "getCategories.php", {})
			.then( function(res) {
			return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getCommerce = function(commerceid){
		return $http.post(url + "getCommerce.php", {"commerceid" : commerceid})
			.then( function(res) {
			return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.sendEmail = function(subject, message, to){
		$http.post(url + "getConfigEmail.php", {'configid' : 1})
			.then( function(res) {
				var email = res.data.email;
				var password = res.data.password;
				$http.post(url + "sendEmail.php", {"subject" : subject, "message" : message, "to" : to,
					"email" : email, "password" : password })
					.then( function(res) {
						return res.data;
				},function(err){
					alert("ERROR: " + err);
					console.log(err)
				})
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getClientMax = function(){
		return $http.get(url + "getClientMax.php", {})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getUser = function(userid){
		return $http.post(url + "getUser.php", {"userid" : userid})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getUserByEmail = function(email){
		return $http.post(url + "getUserByEmail.php", {"user_name" : email})
			.then( function(res) {
				return res.data;
		},function(err){
			alert(url);
			alert("ERROR: " + err.status);
			console.log(err)
		})
	};
	
	service.getUserMax = function(email){
		return $http.post(url + "getUserMax.php", {})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getCardPointsByWeek = function(){
		return $http.get(url + "getClientsByWeek.php", {})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getCardPointsByWeekDates = function(initial_date, final_date){
		return $http.post(url + "getClientsByWeekDates.php", {'initial_date' : getDate(initial_date), 
			'final_date' : getDate(final_date) })
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getClientsByPoints = function(){
		return $http.get(url + "getClientsByPoints.php", {})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getClientsByPointsRange = function(initial_points, final_points){
		return $http.post(url + "getClientsByPointsRange.php", {'initial_points' : initial_points, 
			'final_points' : final_points})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getPointsByClientAndMonth = function(clientid, commerceid){
		return $http.post(url + "getPointsByClientAndMonth.php", {'clientid' : clientid, 'commerceid' : 
			commerceid})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getCommentsByClient = function(clientid){
		return $http.post(url + "getCommentsByClient.php", {'clientid' : clientid})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getComment = function(commentsid){
		return $http.post(url + "getComment.php", {'commentsid' : commentsid})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.saveComment = function(c){
		return $http.post(url + "saveComment.php", {'clientid' : c.clientid, 
			'comments_date' : c.comments_date, 'description' : c.description })
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.updateComment = function(c){
		return $http.post(url + "updateComment.php", {'commentsid' : c.commentsid, 
			'clientid' : c.clientid, 
			'description' : c.description })
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.deleteComment = function(c){
		return $http.post(url + "deleteComment.php", {'commentsid' : c })
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getConfigEmail = function(){
		return $http.post(url + "getConfigEmail.php", {'configid' : 1})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.updateConfigEmail = function(c){
		return $http.post(url + "updateConfigEmail.php", {'configid' : 1, 'email' : c.email, 'password'
			: c.password})
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.getPointsCredentialsDates = function(initial_date, final_date){
		return $http.post(url + "getPointsCredentialsDates.php", {"initial_date" : initial_date,
			"final_date" : final_date })
			.then( function(res) {
			return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	service.getPointsCredentials = function(){
		return $http.get(url + "getPointsCredentials.php", {}).then( function(res) {
			return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	service.getClientsByColumn = function(column, value){
		return $http.post(url + "getClientsByColumn.php", { 'column' : column, 'value' : value })
			.then( function(res) {
			return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	service.getPointsByColumn = function(column, value){
		return $http.post(url + "getPointsByColumn.php", { 'column' : column, 'value' : value })
			.then( function(res) {
			return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	service.getPointsByDates = function(initial_date, final_date){
		return $http.post(url + "getPointsByDates.php", {'initial_date' : getDate(initial_date), 
			'final_date' : getDate(final_date) })
			.then( function(res) {
				return res.data;
		},function(err){
			alert("ERROR: " + err);
			console.log(err)
		})
	};
	
	service.updateValidClient = function(client){
		return $http.post(url + "updateValidClient.php", {"verification_date" : 
			client.verification_date, "active" : 1, "password" : client.pwd1,
			"clientid" : client.clientid })
			.then( function(res) {
				return res.data;
		},function(err){
			console.log(err)
		})
	};
	
	return service;
});

