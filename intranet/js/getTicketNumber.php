<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `ticket_number` FROM `points` WHERE `commerceid` = '$data->commerceid'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>