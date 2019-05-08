<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT c.credential_number, c.name ,c.last_name, c.email, c.phone, DATE_FORMAT(c.birthdate,'%d/%m/%Y') as birthdate, DATE_FORMAT(c.register_date,'%d/%m/%Y') as register_date, c.colony, c.zip, c.gender, c.clientid, (select sum(quantity) from points where clientid = c.clientid) as quantity, (select sum(points) from points where clientid = c.clientid AND valid = 1) as total_points, (select sum(points) from points where clientid = c.clientid AND valid = 0) as no_valid_points FROM client c WHERE active = 1 ORDER BY total_points DESC";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>