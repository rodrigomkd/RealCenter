<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `userid`, `user_name`, `password`, `role`, `active`, `name` FROM `user` WHERE user_name = '$data->user_name'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>