<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT MAX(clientid) as clientid FROM `client`";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>