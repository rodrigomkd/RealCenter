<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `clientid`, `credential_number`, c.name, `last_name`, `email`, `phone`, DATE_FORMAT(birthdate,'%d/%m/%Y') as birthdate, DATE_FORMAT(register_date,'%d/%m/%Y') as register_date, `colony`, `zip`, `gender`, DATE_FORMAT(verification_date,'%d/%m/%Y') as verification_date, u.name AS user FROM client c LEFT OUTER JOIN user u ON c.userid = u.userid WHERE c.active = 1 and verification_date >= '$data->initial_date' and verification_date <= '$data->final_date' ORDER BY clientid DESC";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>