<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT credential_number, p.clientid, sum(quantity) as quantity, sum(points) as points, count(*) as rows, p.register_date FROM points p LEFT OUTER JOIN client c ON p.clientid = c.clientid where p.register_date >= '$data->initial_date' and p.register_date <= '$data->final_date' GROUP BY credential_number ORDER BY credential_number";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>