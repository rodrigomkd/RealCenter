<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "DELETE FROM `commerce` WHERE `commerceid` = '$data->commerceid'";
	$data = $db->qryFire($sql);
	echo json_encode($data);
?>