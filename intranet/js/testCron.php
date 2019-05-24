<?php 
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Content-Type");
	header("Content-Type: application/json");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
?>
<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('verificationPointsScript.php');
	$db = new CRON();
?>