<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `commercetypeid`, `description`, `limited`, `percent` FROM commerce_type ORDER BY description";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>