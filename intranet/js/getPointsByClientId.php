<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT c.commerce_name, DATE_FORMAT(p.buy_date,'%d/%m/%Y') as buy_date, DATE_FORMAT(p.register_date,'%d/%m/%Y') as register_date, client.credential_number, ticket_number, quantity, points, percent from points p left outer join commerce c 
		on p.commerceid = c.commerceid
		left outer join client client
		on p.clientid = client.clientid
		where p.clientid = '$data->clientid'
		ORDER BY p.register_date"
	$data = $db->qryData($sql);
	echo json_encode($data);
?>