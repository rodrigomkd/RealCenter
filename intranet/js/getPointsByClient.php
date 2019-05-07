<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT sum(points) as total_points FROM points WHERE clientid = '$data->clientid'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>