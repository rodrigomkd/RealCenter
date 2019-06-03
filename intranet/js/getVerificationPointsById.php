<?php 
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Content-Type");
	header("Content-Type: application/json");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
?>
<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT verificationid, clientid, DATE_FORMAT(start_date,'%d/%m/%Y') AS start_date, DATE_FORMAT(next_date,'%d/%m/%Y') AS next_date, points FROM `verification_points` WHERE clientid = '$data->clientid' AND points IS NOT NULL";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>