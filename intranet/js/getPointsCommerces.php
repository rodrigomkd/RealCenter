<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT commerce_name, p.commerceid, sum(quantity) as quantity, sum(points) as points, count(*) as rows FROM points p LEFT OUTER JOIN commerce c ON p.commerceid = c.commerceid GROUP BY commerce_name ORDER BY commerce_name";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>