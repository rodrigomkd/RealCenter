<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `pointsid`, c.commerce_name, DATE_FORMAT(buy_date,'%d/%m/%Y') as buy_date, DATE_FORMAT(p.register_date,'%d/%m/%Y') as register_date, client.credential_number, `ticket_number`, `quantity`, `points` as total_points, `comments`, `percent` FROM `points` p left outer join commerce c on p.commerceid = c.commerceid left outer join client on p.clientid = client.clientid WHERE p.register_date >= '$data->initial_date' AND p.register_date <= '$data->final_date' order by p.register_date desc";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>