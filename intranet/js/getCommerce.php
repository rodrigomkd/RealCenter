<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `commerceid`, `commercetypeid`, `commerce_name`, `commerce_number`, c.active FROM commerce c WHERE c.commerceid = '$data->commerceid'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>