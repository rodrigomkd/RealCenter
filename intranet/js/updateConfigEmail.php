<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "UPDATE `config` SET `email`='$data->email',`password`='$data->password' WHERE `configid`='$data->configid'";
		
	$data = $db->qryFire($sql);
?>