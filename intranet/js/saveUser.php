<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "INSERT INTO `user`(`user_name`, `password`, `role`, `active`, `name`) VALUES('$data->user_name','$data->password','$data->role','$data->active','$data->name')";
	$data = $db->qryFire($sql);
?>