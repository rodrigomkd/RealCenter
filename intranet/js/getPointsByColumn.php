<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT credential_number, c.name ,c.last_name, c.email, c.phone, DATE_FORMAT(c.birthdate,'%d/%m/%Y') as birthdate, DATE_FORMAT(c.register_date,'%d/%m/%Y') as register_date, c.colony, c.zip, c.gender, p.clientid, sum(quantity) as quantity, sum(points) as total_points FROM points p LEFT OUTER JOIN client c ON p.clientid = c.clientid WHERE $data->column REGEXP '$data->value' GROUP BY credential_number ORDER BY total_points DESC;";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>