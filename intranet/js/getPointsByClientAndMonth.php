<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT sum(points) as total_points FROM points WHERE clientid = '$data->clientid' AND register_date BETWEEN CONCAT(YEAR(current_date),'-',MONTH(current_date), '-01') AND LAST_DAY(current_date) AND commerceid = '$data->commerceid'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>