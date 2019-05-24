<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "INSERT INTO `verification_points` (clientid, start_date, next_date, points) VALUES ('$data->clientid','$data->start_date',DATE_ADD('$data->start_date', INTERVAL 10 YEAR), 0);";
	$data = $db->qryFire($sql);
	echo json_encode($data);
?>