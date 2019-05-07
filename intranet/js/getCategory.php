<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `commercetypeid`, `description`, `limited`, `percent`, `points` FROM commerce_type c WHERE c.commercetypeid = '$data->categoryid'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>