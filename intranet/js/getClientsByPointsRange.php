<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT credential_number, CONCAT(c.name,' ',c.last_name) as name, c.email, c.phone, c.birthdate, c.register_date, c.colony, c.zip, c.gender, p.clientid, sum(quantity) as quantity, sum(points) as total_points FROM points p LEFT OUTER JOIN client c ON p.clientid = c.clientid GROUP BY credential_number HAVING total_points between '$data->initial_points' AND '$data->final_points' ORDER BY total_points DESC";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>