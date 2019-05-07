<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "INSERT INTO `points`(`clientid`, `buy_date`, `register_date`, `commerceid`, `quantity`, `comments`, `ticket_number`, `percent`, `points`) VALUES('$data->clientid','$data->buy_date','$data->register_date','$data->commerceid','$data->quantity','$data->comments','$data->ticket_number','$data->percent','$data->points')";
	$data = $db->qryFire($sql);
?>