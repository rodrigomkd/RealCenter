<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "UPDATE `user` SET `user_name`='$data->user_name',`password`='$data->password',`role`='$data->role',`active`='$data->active',`name`='$data->name' WHERE userid = '$data->userid'";
		
	$data = $db->qryFire($sql);
?>