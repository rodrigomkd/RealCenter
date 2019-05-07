<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `clientid`, `credential_number`, `name`, `last_name`, `email`, `phone`, DATE_FORMAT(birthdate,'%d/%m/%Y') as birthdate, DATE_FORMAT(register_date,'%d/%m/%Y') as register_date, `colony`, `zip`, `gender`, `active`, `password`, `userid`  FROM `client` WHERE `credential_number` = '$data->credential_number'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>