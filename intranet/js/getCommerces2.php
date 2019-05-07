<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT * FROM `commerce` where commerce_name like 'A%'";
	$data = $db->qryFire();
	echo json_encode($data);
?>