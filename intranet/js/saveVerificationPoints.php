<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "INSERT INTO as buy_date, DATE_FORMAT(p.register_date,'%d/%m/%Y') as register_date, client.credential_number, ticket_number, quantity, points, percent, case when p.valid = 0 then 'red' else 1 end as style from points p left outer join commerce c on p.commerceid = c.commerceid left outer join client client on p.clientid = client.clientid WHERE p.clientid = '$data->clientid' ORDER BY p.pointsid DESC";
	$data = $db->qryFire($sql);
	echo json_encode($data);
?>