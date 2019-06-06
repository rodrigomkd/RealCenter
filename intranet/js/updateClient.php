<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "UPDATE `client` SET `credential_number`='$data->credential_number',`name`='$data->name',`last_name`='$data->last_name',`email`='$data->email',`phone`='$data->phone',`birthdate`='$data->birthdate',`colony`='$data->colony',`zip`='$data->zip',`gender`='$data->gender',`active`='$data->active',`password`='$data->password' WHERE `clientid`='$data->clientid'";
		
	$data = $db->qryFire($sql);
	//$db->qryFire($sql);
?>