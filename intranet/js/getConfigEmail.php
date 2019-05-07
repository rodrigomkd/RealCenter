<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `email`, `password` FROM config c WHERE c.configid = '$data->configid'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>
