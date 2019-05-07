<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT DATE_FORMAT(register_date,'%d/%m/%Y') as register_date, p.commerceid, quantity, points, 1 as rows FROM points p LEFT OUTER JOIN commerce c ON p.commerceid = c.commerceid WHERE p.clientid = '$data->clientid' and p.commerceid = '$data->commerceid' ORDER BY register_date";
	
	$data = $db->qryData($sql);
	echo json_encode($data);
?>