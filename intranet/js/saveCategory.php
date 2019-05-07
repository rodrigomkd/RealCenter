<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "INSERT INTO `commerce_type`(`description`, `limited`, `percent`, `points`) VALUES('$data->description','$data->limited','$data->percent','$data->points')";
	$data = $db->qryFire($sql);
?>