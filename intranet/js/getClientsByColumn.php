<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `clientid`, `credential_number`, c.name, `last_name`, `email`, `phone`, DATE_FORMAT(birthdate,'%d/%m/%Y') as birthdate, DATE_FORMAT(register_date,'%d/%m/%Y') as register_date, `colony`, `zip`, `gender`, DATE_FORMAT(verification_date,'%d/%m/%Y') as verification_date, u.name AS user FROM `client` c LEFT OUTER JOIN user u ON c.userid = u.userid WHERE $data->column REGEXP '$data->value' ORDER BY `register_date` DESC";	
	$data = $db->qryData($sql);
	echo json_encode($data);
?>