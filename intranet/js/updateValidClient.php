<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "UPDATE `client` SET `verification_date`='$data->verification_date',`active`='$data->active',`password`='$data->password' WHERE `clientid`='$data->clientid'";
		
	$data = $db->qryFire($sql);
?>