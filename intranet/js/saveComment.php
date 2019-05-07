<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "INSERT INTO `comments`(`clientid`, `comments_date`, `description`) VALUES ('$data->clientid','$data->comments_date','$data->description')";
	$data = $db->qryFire($sql);
?>