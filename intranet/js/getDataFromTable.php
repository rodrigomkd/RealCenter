<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT * FROM '$data->table'";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>