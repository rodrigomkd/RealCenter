<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT credential_number, p.clientid, sum(quantity) as quantity, sum(points) as points, count(*) as rows FROM points p LEFT OUTER JOIN client c ON p.clientid = c.clientid GROUP BY credential_number ORDER BY credential_number";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>